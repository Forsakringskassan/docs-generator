import fs from "node:fs/promises";
import path from "node:path";
import fm from "front-matter";
import pkg from "../../package.json" with { type: "json" };
import {
    type Document,
    type DocumentPage,
    getDocumentBody,
    isDocumentPage,
    isDocumentPartial,
} from "../document";
import { type PartialFile, type SourceFiles } from "../file-reader";
import { type Manifest } from "../manifest";
import { type Processor, type ProcessorOptions } from "../processor";
import {
    findDocument,
    getFingerprint,
    getOutputFilePath,
    haveOutput,
    takeWhile,
    zip,
} from "../utils";
import { manifestState } from "./manifest-processor";

type ManifestPage = Manifest["pages"][number];

/**
 * Serializable metadata exported with extracted documentation.
 *
 * This interface can be augmented to describe application-specific metadata.
 *
 * @public
 * @since %version%
 */
/* eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style -- interface supports module augmentation */
export interface ExtractedDocsMetadata {
    [key: string]: unknown;
}

/**
 * Type representing the exported docs module when extracting markdown
 * documents.
 *
 * @privateRemarks
 *
 * Changes to this interface must be kept in sync with the output generated in
 * `writeDts()`.
 *
 * @public
 * @since %version%
 */
export interface ExtractedDocsModule {
    readonly generatorVersion: string;
    readonly version: string | null;
    readonly metadata: ExtractedDocsMetadata | null;
    readonly basePath: string;
    readonly exampleFolders: string[];
    readonly filesPath: string;
    readonly partialsPath: string;
    readonly linksPath: string;
    sourceFiles(this: void, src?: Partial<SourceFiles>): SourceFiles[];
}

/**
 * Options for `extractMarkdownProcessor`.
 *
 * @public
 */
export interface ExtractMarkdownOptions extends ProcessorOptions {
    /**
     * Folder to write docs to.
     */
    outputFolder: string;

    /**
     * Version written to the `version` field of the generated `index.mjs`.
     */
    version?: string;

    /**
     * Callback providing serializable metadata for the generated `index.mjs`.
     *
     * Called once per extraction and awaited. Missing callbacks and nullish
     * results are exported as `null`.
     */
    metadata?: () =>
        | ExtractedDocsMetadata
        | undefined
        | null
        | Promise<ExtractedDocsMetadata | undefined | null>;
}

/**
 * @internal
 */
export interface ApiContainerData {
    /** full matched string including the begin and end `:::` markers. */
    match: string;
    /** infostring tags */
    tags: string[];
    /** body of the container */
    content: string;
}

async function copyFile(src: string, dst: string): Promise<void> {
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.cp(src, dst);
}

function equal<T>(values: [T, T]): boolean {
    return values[0] === values[1];
}

/**
 * Finds the common path segments from two paths.
 */
function commonPath(a: string, b: string): string {
    const it = zip(a.split(path.sep), b.split(path.sep));
    const common = Array.from(takeWhile(it, equal), (it) => it[0]);
    return common.join(path.sep);
}

const RESOLVE_EXTENSIONS = [
    "",
    ".ts",
    ".tsx",
    ".js",
    ".mts",
    ".vue",
    ".json",
    "/index.ts",
    "/index.js",
];

/**
 * Resolves a relative import specifier to an actual file path on disk.
 * Prepared for adding alias support (e.g. `@/`) in the future.
 */
async function resolveImportPath(
    specifier: string,
    fromFile: string,
): Promise<string | null> {
    if (!specifier.startsWith(".")) {
        return null;
    }

    const baseDir = path.dirname(fromFile);
    const rawTarget = path.resolve(baseDir, specifier);

    for (const ext of RESOLVE_EXTENSIONS) {
        const candidate = `${rawTarget}${ext}`;
        try {
            const stat = await fs.stat(candidate);
            if (stat.isFile()) {
                return candidate;
            }
        } catch {
            /* try next extension */
        }
    }

    return null;
}

/**
 * Checks whether a target file referenced via `export *` actually exports
 * at least one of the requested symbol names.
 */
async function fileExportsAnySymbol(
    filePath: string,
    requestedNames: Set<string>,
): Promise<boolean> {
    try {
        const content = await fs.readFile(filePath, "utf8");
        for (const name of requestedNames) {
            const escaped = name.replaceAll(
                /[.*+?^${}()|[\]\\]/g,
                String.raw`\$&`,
            );
            const exportDeclPattern = new RegExp(
                `\\bexport\\s+(?:declare\\s+)?(?:function|const|let|var|class|type|interface|enum)\\s+${escaped}\\b|\\bexport\\s*\\{[^}]*\\b${escaped}\\b`,
            );
            if (exportDeclPattern.test(content)) {
                return true;
            }
        }
    } catch {
        return false;
    }
    return false;
}

interface RelativeImport {
    specifier: string;
    importedNames: Set<string> | null;
    isWildcardReExport: boolean;
}

/**
 * Extracts relative import specifiers (and optional named symbols) from `.vue`, `.ts`, and `.js` files.
 */
function findRelativeImports(
    content: string,
    isBarrelFile: boolean,
    requestedNames: Set<string> | null,
): RelativeImport[] {
    const results = new Map<string, RelativeImport>();

    const addImport = (
        specifier: string,
        names: Set<string> | null,
        isWildcardReExport = false,
    ): void => {
        const existing = results.get(specifier);
        if (existing === undefined) {
            results.set(specifier, {
                specifier,
                importedNames: names,
                isWildcardReExport,
            });
            return;
        }
        if (!isWildcardReExport) {
            existing.isWildcardReExport = false;
        }
        if (existing.importedNames !== null && names !== null) {
            for (const name of names) {
                existing.importedNames.add(name);
            }
        } else {
            existing.importedNames = null;
        }
    };

    const namedImportPattern =
        /\bimport\s([^;"']*?)\bfrom\s*["'](\.[^"']+)["']/g;
    for (const match of content.matchAll(namedImportPattern)) {
        const clause = match.at(1);
        const specifier = match.at(2);
        if (clause && specifier) {
            addImport(specifier, parseImportedNames(clause));
        }
    }

    const sideEffectPattern = /\bimport\s*["'](\.[^"']+)["']/g;
    for (const match of content.matchAll(sideEffectPattern)) {
        const specifier = match.at(1);
        if (specifier) {
            addImport(specifier, null);
        }
    }

    const dynamicPattern = /\bimport\(\s*["'](\.[^"']+)["']\s*\)/g;
    for (const match of content.matchAll(dynamicPattern)) {
        const specifier = match.at(1);
        if (specifier) {
            addImport(specifier, null);
        }
    }

    const exportPattern = /\bexport\s([^;"']*?)\bfrom\s*["'](\.[^"']+)["']/g;
    for (const match of content.matchAll(exportPattern)) {
        const clause = match.at(1);
        const specifier = match.at(2);
        if (!clause || !specifier) {
            continue;
        }
        if (isBarrelFile && specifier.startsWith("..")) {
            continue;
        }
        const exportedNames = parseImportedNames(clause);
        /* In a barrel file with requested names, skip named re-exports that don't match */
        if (
            isBarrelFile &&
            requestedNames !== null &&
            exportedNames !== null &&
            Array.from(exportedNames).every((name) => !requestedNames.has(name))
        ) {
            continue;
        }
        const isWildcard =
            isBarrelFile && requestedNames !== null && exportedNames === null;
        addImport(specifier, null, isWildcard);
    }

    return Array.from(results.values());
}

/**
 * Checks whether `targetPath` is located inside `rootDir`.
 */
function isInsideDirectory(targetPath: string, rootDir: string): boolean {
    const relative = path.relative(rootDir, targetPath);
    return (
        relative !== "" &&
        !relative.startsWith("..") &&
        !path.isAbsolute(relative)
    );
}

interface RelativeImport {
    specifier: string;
    importedNames: Set<string> | null;
}

/**
 * Extracts imported symbol names from an import clause like `{ Point, type Rect, foo as bar }`.
 * Returns `null` for namespace/default/side-effect imports where specific names cannot be filtered.
 */
function parseImportedNames(clause: string): Set<string> | null {
    const braceMatch = /\{([^}]+)\}/.exec(clause);
    const inner = braceMatch?.at(1);
    if (!inner) {
        return null;
    }

    const names = new Set<string>();
    for (const part of inner.split(",")) {
        const cleaned = part.replaceAll(/\btype\b/g, "").trim();
        if (!cleaned) {
            continue;
        }
        /* `foo as bar` -> original exported name is `foo` */
        const originalName = cleaned
            .split(/\s+as\s+/, 2)
            .at(0)
            ?.trim();
        if (originalName) {
            names.add(originalName);
        }
    }

    return names.size > 0 ? names : null;
}

async function pruneVisitedBarrels(visited: Set<string>): Promise<void> {
    const exportPattern =
        /^[ \t]*export\s[^;"']*?\bfrom\s*["'](\.[^"']+)["'];?[ \t]*\r?\n?/gm;

    for (const entry of visited) {
        if (!entry.startsWith("barrel:")) {
            continue;
        }
        const barrelPath = entry.slice("barrel:".length);
        const content = await fs.readFile(barrelPath, "utf8");
        let updated = content;

        for (const match of content.matchAll(exportPattern)) {
            const fullStatement = match[0];
            const specifier = match[1];
            if (!specifier) {
                continue;
            }
            const resolvedInOutput = await resolveImportPath(
                specifier,
                barrelPath,
            );
            if (!resolvedInOutput) {
                updated = updated.replace(fullStatement, "");
            }
        }

        if (updated !== content) {
            await fs.writeFile(barrelPath, updated, "utf8");
        }
    }
}

interface CopyDependencyOptions {
    exampleDir: string | null;
    allowedRoot: string;
    outputFolder: string;
    visited: Set<string>;
}

async function copyFileWithDependencies(
    srcFile: string,
    options: CopyDependencyOptions,
    requestedNames: Set<string> | null = null,
): Promise<void> {
    const { exampleDir, allowedRoot, outputFolder, visited } = options;
    const resolvedSrc = path.resolve(srcFile);
    const visitKey = requestedNames
        ? `${resolvedSrc}:${Array.from(requestedNames)
              .toSorted((a, b) => a.localeCompare(b))
              .join(",")}`
        : resolvedSrc;
    if (visited.has(visitKey)) {
        return;
    }
    visited.add(visitKey);

    const common = commonPath(path.resolve(outputFolder), resolvedSrc);
    const subpath = path.relative(common, resolvedSrc);
    const destPath = path.join(outputFolder, "files", subpath);

    if (!visited.has(`copied:${destPath}`)) {
        visited.add(`copied:${destPath}`);
        await copyFile(resolvedSrc, destPath);
    }

    const ext = path.extname(resolvedSrc);
    if (![".vue", ".ts", ".tsx", ".js", ".mts"].includes(ext)) {
        return;
    }

    const content = await fs.readFile(resolvedSrc, "utf8");
    const isBarrelFile = path.basename(resolvedSrc).startsWith("index.");
    if (isBarrelFile) {
        visited.add(`barrel:${destPath}`);
    }

    const imports = findRelativeImports(content, isBarrelFile, requestedNames);

    for (const { specifier, importedNames, isWildcardReExport } of imports) {
        const dependencyPath = await resolveImportPath(specifier, resolvedSrc);
        if (
            !dependencyPath ||
            !isInsideDirectory(dependencyPath, allowedRoot)
        ) {
            continue;
        }

        if (
            isWildcardReExport &&
            requestedNames !== null &&
            !(await fileExportsAnySymbol(dependencyPath, requestedNames))
        ) {
            continue;
        }

        const isVueFile = path.extname(dependencyPath) === ".vue";
        const isInsideExamples =
            exampleDir !== null &&
            isInsideDirectory(dependencyPath, exampleDir);
        if (isVueFile && !isInsideExamples) {
            continue;
        }

        await copyFileWithDependencies(dependencyPath, options, importedNames);
    }
}

/**
 * Finds the package `src` directory as the outer boundary for relative imports,
 * falling back to the parent of `examples`/`docs` if no `src` folder exists.
 */
function findAllowedRoot(srcFile: string, exampleDir: string | null): string {
    const resolved = path.resolve(srcFile);
    let current = path.dirname(resolved);
    let parent = path.dirname(current);

    while (current !== parent) {
        if (path.basename(current) === "src") {
            return current;
        }
        current = parent;
        parent = path.dirname(current);
    }

    return exampleDir ? path.dirname(exampleDir) : path.dirname(resolved);
}

const EXAMPLE_ROOT_DIRS = new Set(["examples", "docs"]);

/**
 * Finds the nearest ancestor directory named `examples` or `docs`.
 */
function findExampleDir(srcFile: string): string | null {
    const resolved = path.resolve(srcFile);
    let current = path.dirname(resolved);
    let parent = path.dirname(current);

    while (current !== parent) {
        if (EXAMPLE_ROOT_DIRS.has(path.basename(current))) {
            return current;
        }
        current = parent;
        parent = path.dirname(current);
    }

    return null;
}

async function extractExamples(
    page: ManifestPage,
    options: { outputFolder: string; visited: Set<string> },
): Promise<void> {
    const { outputFolder, visited } = options;
    for (const example of page.examples) {
        /* inline examples do not have a source file */
        if (!example.src) {
            continue;
        }
        const exampleDir = findExampleDir(example.src);
        const allowedRoot = findAllowedRoot(example.src, exampleDir);

        await copyFileWithDependencies(example.src, {
            exampleDir,
            allowedRoot,
            outputFolder,
            visited,
        });
    }
}

function isMarkdown(doc: DocumentPage): boolean {
    return doc.format === "markdown";
}

async function getFrontMatter(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath, "utf8");
    const { attributes } = fm<Record<string, unknown>>(content);
    delete attributes.redirect_from;
    if (Object.keys(attributes).length === 0) {
        return "";
    }
    return `---\n${JSON.stringify(attributes)}\n---\n\n`;
}

function cmp(this: void, a: [string, string], b: [string, string]): number {
    return a[0].localeCompare(b[0]);
}

/**
 * Finds and replaces API container blocks in markdown content.
 *
 * ```md
 * ::: api foo bar
 * lorem ipsum
 * :::
 * ```
 *
 * Given the above example the `cb` callback would be called with:
 *
 * - `match` - the full string including the begin and end `:::` markers.
 * - `tags` - `["foo", "bar"]`.
 * - `content` - `"lorem ipsum"`.
 *
 * @internal
 * @param text - markdown content
 * @param cb - callback called once for every api container block
 * @returns updated markdown content
 */
export function findApiContainer(
    text: string,
    cb: (container: ApiContainerData) => string,
): string {
    const regex = /^:::[ \t]*api(?=[ \t]|\r?\n)([^\n]*)\n([\s\S]+?):::\n/gm;
    return text.replaceAll(regex, (match, info: string, rawContent: string) => {
        const content = rawContent.trim();
        const trimmedInfo = info.trim();
        const tags = trimmedInfo ? trimmedInfo.split(/\s+/) : [];
        return cb({ match, tags, content });
    });
}

/**
 * Extracts and replaces the API container with a placeholder value (later
 * stored in the `partials.json` file).
 *
 * @internal
 * @param docs - All available documents.
 * @param partials - Extracted partials are written to this map with the placeholder value as key.
 * @param container - Container data from `findApiContainer()`.
 * @returns updated markdown content.
 */
export function onApiContainer(
    docs: Document[],
    partials: Map<string, PartialFile>,
    container: ApiContainerData,
): string {
    const { match, tags, content } = container;

    const result = findDocument(docs, content);
    if (!result.document) {
        return match;
    }

    const { document, kind, reference } = result;
    if (!isDocumentPartial(document)) {
        return match;
    }

    const body = getDocumentBody(document, tags, {
        kind,
        reference,
    });
    const fingerprint = getFingerprint(body);
    const id = `partial:${document.format}:${fingerprint}`;

    partials.set(id, {
        id,
        format: document.format,
        body,
    });

    return `:::api\n${id}\n:::\n`;
}

async function extractDocument(
    doc: DocumentPage,
    docs: Document[],
    partials: Map<string, PartialFile>,
    options: { outputFolder: string; visited: Set<string> },
): Promise<void> {
    const { outputFolder } = options;
    const markdown = findApiContainer(doc.body, (container) => {
        return onApiContainer(docs, partials, container);
    });

    const src = doc.fileInfo.fullPath;
    const dst = path.join(outputFolder, "files", doc.fileInfo.fullPath);
    const fm = await getFrontMatter(src);
    const content = `${fm}${markdown}`;

    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, content, "utf8");
    await extractMarkdownImages(src, options);
    await extractMarkdownImports(src, content, options);
}

async function extractDocuments(
    docs: Document[],
    partials: Map<string, PartialFile>,
    options: { outputFolder: string; visited: Set<string> },
): Promise<void> {
    const files = docs
        .filter(isDocumentPage)
        .filter(isMarkdown)
        .filter(haveOutput)
        .map((doc) => extractDocument(doc, docs, partials, options));
    await Promise.all(files);
}

async function extractPartials(
    partials: Map<string, PartialFile>,
    options: { outputFolder: string },
): Promise<void> {
    const { outputFolder } = options;
    const dst = path.join(outputFolder, "partials.json");
    const content = JSON.stringify(Array.from(partials.values()), null, 2);
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, content, "utf8");
}

async function extractLinks(
    docs: Document[],
    options: { outputFolder: string },
): Promise<void> {
    const { outputFolder } = options;
    const links = new Map<string, string>();
    const pages = docs.filter(isDocumentPage).filter(haveOutput);
    for (const page of pages) {
        const path = getOutputFilePath("", page.fileInfo);
        links.set(page.id, path);
        if (!links.has(page.name)) {
            links.set(page.name, path);
        }
        for (const alias of page.alias) {
            if (!links.has(alias)) {
                links.set(alias, path);
            }
        }
    }
    const sorted = Array.from(links).toSorted(cmp);
    const entries = Object.fromEntries(sorted);
    const content = JSON.stringify(entries, null, 2);
    const dst = path.join(outputFolder, "links.json");
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, content, "utf8");
}

/**
 * Generates the lines of the `index.mjs` module.
 *
 * @internal
 */
export function generateIndex(options: {
    generatorVersion: string;
    version: string | null;
    metadata?: ExtractedDocsMetadata | null;
}): string[] {
    const { generatorVersion, version, metadata = null } = options;
    return [
        `import path from "node:path";`,
        `import { frontMatterFileReader, partialFileReader } from "@forsakringskassan/docs-generator";`,
        ``,
        `export const generatorVersion = ${JSON.stringify(generatorVersion)};`,
        `export const version = ${JSON.stringify(version)};`,
        `export const metadata = ${JSON.stringify(metadata)};`,
        `export const basePath = import.meta.dirname;`,
        `export const exampleFolders = [path.join(basePath, "files")];`,
        `export const filesPath = path.join(basePath, "files");`,
        `export const partialsPath = [path.join(basePath, "partials.json")];`,
        `export const linksPath = [path.join(basePath, "links.json")];`,
        ``,
        `export function sourceFiles(src = {}) {`,
        `    return [`,
        `        { `,
        `            include: path.join(filesPath, "**/*.md"),`,
        `            basePath: filesPath,`,
        `            fileReader: frontMatterFileReader,`,
        `            ...src`,
        `        },`,
        `        { `,
        `            include: path.join(basePath, "partials.json"),`,
        `            basePath,`,
        `            fileReader: partialFileReader,`,
        `        }`,
        `    ];`,
        `}`,
    ];
}

async function writeIndex(options: {
    outputFolder: string;
    version: string | null;
    metadata: ExtractedDocsMetadata | null;
}): Promise<void> {
    const { outputFolder, version, metadata } = options;
    const dst = path.join(outputFolder, "index.mjs");
    const lines = generateIndex({
        generatorVersion: pkg.version,
        version,
        metadata,
    });
    await fs.writeFile(dst, lines.join("\n"), "utf8");
}

async function writeDts(options: { outputFolder: string }): Promise<void> {
    const { outputFolder } = options;
    const dst = path.join(outputFolder, "index.d.mts");

    /* changes to this output must be in sync with the `ExtractedDocsModule` interface */
    const lines = [
        `import { ExtractedDocsMetadata, SourceFiles } from "@forsakringskassan/docs-generator";`,
        ``,
        `export declare const generatorVersion: string;`,
        `export declare const version: string | null;`,
        `export declare const metadata: ExtractedDocsMetadata | null;`,
        `export declare const basePath: string;`,
        `export declare const exampleFolders: string[];`,
        `export declare const filesPath: string;`,
        `export declare const partialsPath: string;`,
        `export declare const linksPath: string;`,
        ``,
        `export declare function sourceFiles(this: void, src?: Partial<SourceFiles>): SourceFiles[];`,
    ];

    await fs.writeFile(dst, lines.join("\n"), "utf8");
}

/**
 * Resolves a filename from a `import ` block relative to the markdown file
 * or within `examples`/`docs` folders in the repository.
 */
async function resolveExampleImport(
    markdownFile: string,
    filename: string,
): Promise<string | null> {
    const mdDir = path.dirname(path.resolve(markdownFile));
    const directCandidates = [
        path.resolve(mdDir, filename),
        path.resolve(mdDir, "examples", filename),
    ];

    for (const candidate of directCandidates) {
        try {
            const stat = await fs.stat(candidate);
            if (stat.isFile()) {
                return candidate;
            }
        } catch {
            /* try next candidate */
        }
    }

    /* Search inside any `examples` or `docs` directory in the repo (Node 22+ built-in fs.glob) */
    const cwd = process.cwd();
    const pattern = `**/{examples,docs}/**/${filename}`;
    const matches = fs.glob(pattern, { cwd });

    for await (const match of matches) {
        return path.resolve(cwd, match);
    }

    return null;
}

/**
 * Finds  import ...  code blocks in markdown (including hidden examples
 * that may not be present in `manifest.pages`) and copies them with dependencies.
 */
async function extractMarkdownImports(
    markdownFile: string,
    markdownContent: string,
    options: { outputFolder: string; visited: Set<string> },
): Promise<void> {
    const { outputFolder, visited } = options;

    /* Matches fenced code blocks starting with ```import (with optional attributes like hidden, name=..., compare=...) */
    const importBlockPattern =
        /^```import\b[^\n]+\bhidden\b[^\n]*\n([^`\n]+)\n```/gm;

    for (const match of markdownContent.matchAll(importBlockPattern)) {
        const rawFilename = match.at(1)?.trim();
        if (!rawFilename) {
            continue;
        }

        const resolvedFile = await resolveExampleImport(
            markdownFile,
            rawFilename,
        );
        if (!resolvedFile) {
            continue;
        }

        const exampleDir = findExampleDir(resolvedFile);
        const allowedRoot = findAllowedRoot(resolvedFile, exampleDir);

        await copyFileWithDependencies(resolvedFile, {
            exampleDir,
            allowedRoot,
            outputFolder,
            visited,
        });
    }
}

/**
 * Finds relative image references in a markdown file (e.g. `![alt](./image.png)`)
 * and copies the referenced files to the output folder preserving relative paths.
 */
async function extractMarkdownImages(
    markdownFile: string,
    options: { outputFolder: string; visited: Set<string> },
): Promise<void> {
    const { outputFolder, visited } = options;
    const content = await fs.readFile(markdownFile, "utf8");

    /* Matches markdown images `![alt](path)` and HTML `<img src="path">` with relative paths */
    const mdImagePattern = /!\[[^\]]*\]\(\s*(\.[^)\s]+)/g;
    const htmlImagePattern = /<img\b[^>]+?\bsrc=["'](\.[^"']+)["']/gi;

    const specifiers = [
        ...Array.from(content.matchAll(mdImagePattern), (m) => m[1]),
        ...Array.from(content.matchAll(htmlImagePattern), (m) => m[1]),
    ];

    for (const specifier of specifiers) {
        if (!specifier) {
            continue;
        }

        const cleanSpecifier = specifier.split(/[?#]/, 2)[0];
        if (!cleanSpecifier) {
            continue;
        }

        const resolvedImage = path.resolve(
            path.dirname(markdownFile),
            cleanSpecifier,
        );

        try {
            const stat = await fs.stat(resolvedImage);
            if (!stat.isFile()) {
                continue;
            }
        } catch {
            continue;
        }

        const subpath = path.relative(process.cwd(), resolvedImage);
        const destPath = path.join(outputFolder, "files", subpath);

        if (visited.has(`copied:${destPath}`)) {
            continue;
        }
        visited.add(`copied:${destPath}`);
        await copyFile(resolvedImage, destPath);
    }
}

/**
 * Processor to extract and write examples to separate files.
 *
 * @public
 */
export function extractMarkdownProcessor(
    options: ExtractMarkdownOptions,
): Processor {
    const {
        enabled = true,
        outputFolder,
        version = null,
        metadata: metadataFn,
    } = options;

    return {
        after: "render",
        name: "extract-markdown-processor",
        async handler(context) {
            if (!enabled) {
                return;
            }

            if (!outputFolder) {
                throw new Error(
                    `"outputFolder" not set in "extractMarkdownProcessor(..)"`,
                );
            }

            const manifest = context.getState(manifestState);
            if (!manifest) {
                throw new Error(
                    `"extractMarkdownProcessor()" requires "manifestProcess()"`,
                );
            }

            /* clear and recreate old output folder */
            await fs.rm(outputFolder, { recursive: true, force: true });
            await fs.mkdir(outputFolder, { recursive: true });

            /* copy all resources from rendered pages */
            const partials = new Map<string, PartialFile>();
            const visited = new Set<string>();
            await extractDocuments(context.docs, partials, {
                outputFolder,
                visited,
            });
            await extractPartials(partials, { outputFolder });
            await extractLinks(context.docs, { outputFolder });
            const { pages } = manifest;
            const resources = pages.map((page) => {
                return extractExamples(page, { outputFolder, visited });
            });
            await Promise.all(resources);
            await pruneVisitedBarrels(visited);
            /* write an index for programmatical usage */
            const metadata = (await metadataFn?.()) ?? null;
            await writeIndex({
                outputFolder,
                version,
                metadata,
            });
            await writeDts({ outputFolder });
        },
    };
}
