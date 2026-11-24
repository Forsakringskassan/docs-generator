import path from "node:path";
import ts from "typescript";
import { createChecker, createCheckerByJson } from "vue-component-meta";
import { type VueFileReaderOptions } from "./vue-file-reader-options";

/**
 * @internal
 */
export type ComponentMetaChecker = ReturnType<typeof createChecker>;

interface ProjectInfo {
    readonly fileNames: ReadonlySet<string>;
    readonly references: readonly string[];
}

interface CheckerEntry {
    readonly checker: ComponentMetaChecker;
    /** File contents last given to (or read by) the checker, keyed by file path */
    readonly knownContent: Map<string, string>;
    readonly projectFileNames: ReadonlySet<string>;
}

const INFERRED_PROJECT = "<inferred>";

/* Compiler options for components not included by any tsconfig */
const inferredCompilerOptions = {
    target: "esnext",
    module: "esnext",
    moduleResolution: "bundler",
    strict: true,
    allowJs: true,
    skipLibCheck: true,
    noEmit: true,
};

const vueFileExtension: ts.FileExtensionInfo = {
    extension: "vue",
    isMixedContent: true,
    scriptKind: ts.ScriptKind.Deferred,
};

const projectInfoCache = new Map<string, ProjectInfo>();
const checkerCache = new Map<string, CheckerEntry>();

function toFileKey(filePath: string): string {
    const normalizedPath = path.resolve(filePath).replaceAll("\\", "/");
    return ts.sys.useCaseSensitiveFileNames
        ? normalizedPath
        : normalizedPath.toLowerCase();
}

function readProjectInfo(tsconfigPath: string): ProjectInfo {
    const cachedProjectInfo = projectInfoCache.get(tsconfigPath);
    if (cachedProjectInfo) {
        return cachedProjectInfo;
    }
    const configSourceFile = ts.readJsonConfigFile(tsconfigPath, (fileName) =>
        ts.sys.readFile(fileName),
    );
    const parsedConfig = ts.parseJsonSourceFileConfigFileContent(
        configSourceFile,
        ts.sys,
        path.dirname(tsconfigPath),
        undefined,
        tsconfigPath,
        undefined,
        [vueFileExtension],
    );
    const projectInfo: ProjectInfo = {
        fileNames: new Set(parsedConfig.fileNames.map(toFileKey)),
        references: (parsedConfig.projectReferences ?? []).map((reference) => {
            return ts.resolveProjectReferencePath(reference);
        }),
    };
    projectInfoCache.set(tsconfigPath, projectInfo);
    return projectInfo;
}

/**
 * Depth-first search for the project (following project references) that
 * includes the given file.
 */
function findProjectIncluding(
    tsconfigPath: string,
    fileKey: string,
    visitedConfigs: Set<string>,
): string | null {
    if (visitedConfigs.has(tsconfigPath) || !ts.sys.fileExists(tsconfigPath)) {
        return null;
    }
    visitedConfigs.add(tsconfigPath);
    const projectInfo = readProjectInfo(tsconfigPath);
    if (projectInfo.fileNames.has(fileKey)) {
        return tsconfigPath;
    }
    for (const referencedConfig of projectInfo.references) {
        const includingProject = findProjectIncluding(
            referencedConfig,
            fileKey,
            visitedConfigs,
        );
        if (includingProject) {
            return includingProject;
        }
    }
    return null;
}

/**
 * Resolve which tsconfig to use for a component.
 *
 * @internal
 */
export function resolveTsconfig(
    filePath: string,
    options: VueFileReaderOptions,
): string | null {
    if (options.tsconfig) {
        return path.resolve(options.tsconfig);
    }
    const nearestTsconfig = ts.findConfigFile(
        path.dirname(path.resolve(filePath)),
        (fileName) => ts.sys.fileExists(fileName),
        "tsconfig.json",
    );
    if (!nearestTsconfig) {
        return null;
    }
    const resolvedNearestTsconfig = path.resolve(nearestTsconfig);
    return (
        findProjectIncluding(
            resolvedNearestTsconfig,
            toFileKey(filePath),
            new Set(),
        ) ?? resolvedNearestTsconfig
    );
}

function createCheckerEntry(tsconfigPath: string | null): CheckerEntry {
    /* `schema` is resolved lazily and only used for slot bindings */
    const checkerOptions = { schema: true };
    if (tsconfigPath) {
        return {
            checker: createChecker(tsconfigPath, checkerOptions),
            knownContent: new Map(),
            projectFileNames: readProjectInfo(tsconfigPath).fileNames,
        };
    }
    return {
        checker: createCheckerByJson(
            process.cwd(),
            { compilerOptions: inferredCompilerOptions, include: [] },
            checkerOptions,
        ),
        knownContent: new Map(),
        projectFileNames: new Set(),
    };
}

/**
 * Get a (cached) `vue-component-meta` checker for the component and make sure
 * it sees the current content of the file.
 *
 * Checkers are cached per tsconfig so the TypeScript program is only built
 * once per project and reused for all components in it.
 *
 * @internal
 */
export function getComponentMetaChecker(
    filePath: string,
    content: string,
    options: VueFileReaderOptions = {},
): ComponentMetaChecker {
    const tsconfigPath = resolveTsconfig(filePath, options);
    const cacheKey = tsconfigPath ?? INFERRED_PROJECT;
    let checkerEntry = checkerCache.get(cacheKey);
    if (!checkerEntry) {
        checkerEntry = createCheckerEntry(tsconfigPath);
        checkerCache.set(cacheKey, checkerEntry);
    }

    const fileKey = toFileKey(filePath);
    const previousContent = checkerEntry.knownContent.get(fileKey);
    const isProjectFile = checkerEntry.projectFileNames.has(fileKey);
    /* Files in the project are read from disk by the checker itself, calling
     * `updateFile()` invalidates the program so it is only done when needed:
     * when the file is not part of the project or its content has changed
     * since the last time (i.e. watch mode). */
    const needsUpdate =
        previousContent === undefined
            ? !isProjectFile
            : previousContent !== content;
    if (needsUpdate) {
        checkerEntry.checker.updateFile(
            path.resolve(filePath).replaceAll("\\", "/"),
            content,
        );
    }
    checkerEntry.knownContent.set(fileKey, content);
    return checkerEntry.checker;
}

/**
 * Drop all cached checkers, mostly useful for tests.
 *
 * @internal
 */
export function clearComponentMetaCheckers(): void {
    checkerCache.clear();
    projectInfoCache.clear();
}
