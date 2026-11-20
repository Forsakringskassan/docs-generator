import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

/**
 * Läser in compilerOptions från närmaste tsconfig.json (om den finns).
 */
function loadCompilerOptions(cwd: string): ts.CompilerOptions {
    const configPath = ts.findConfigFile(
        cwd,
        (fileName) => ts.sys.fileExists(fileName),
        "tsconfig.json",
    );
    if (!configPath) {
        return { moduleResolution: ts.ModuleResolutionKind.Bundler };
    }

    const configFile = ts.readConfigFile(configPath, (fileName) =>
        ts.sys.readFile(fileName),
    );
    const parsed = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        path.dirname(configPath),
    );
    return parsed.options;
}

/**
 * Plockar ut <script>-blocket ur en .vue-fil, annars returneras hela filen.
 */
function extractScriptContent(filePath: string, content: string): string {
    if (!filePath.endsWith(".vue")) {
        return content;
    }
    const match = /<script[^>]*>([\s\S]*?)<\/script>/i.exec(content);
    return match ? match[1] : "";
}

/**
 * Samlar rekursivt in alla lokala filberoenden (inklusive rena typfiler)
 * med hjälp av TypeScript Compiler API.
 */
export function collectLocalImports(
    entryFiles: Iterable<string>,
    cwd: string = process.cwd(),
): Set<string> {
    const collected = new Set<string>();
    const queue = Array.from(entryFiles, (file) => path.resolve(cwd, file));
    const compilerOptions = loadCompilerOptions(cwd);

    while (queue.length > 0) {
        const currentFile = queue.pop();
        if (!currentFile) {
            continue;
        }

        const relPath = path.relative(cwd, currentFile).replaceAll("\\", "/");

        if (
            relPath.startsWith("..") ||
            relPath.includes("node_modules/") ||
            collected.has(relPath) ||
            !existsSync(currentFile)
        ) {
            continue;
        }

        collected.add(relPath);

        const rawContent = readFileSync(currentFile, "utf8");
        const scriptContent = extractScriptContent(currentFile, rawContent);

        /* Använder TS egen snabba import-skanner (fångar alla typer av imports) */
        const { importedFiles } = ts.preProcessFile(scriptContent, true, true);

        for (const imported of importedFiles) {
            const resolvedPath = resolveImportPath(
                imported.fileName,
                currentFile,
                compilerOptions,
            );
            if (resolvedPath) {
                queue.push(resolvedPath);
            }
        }
    }

    return collected;
}

function resolveImportPath(
    specifier: string,
    containingFile: string,
    compilerOptions: ts.CompilerOptions,
): string | null {
    /* Hantera .vue-importer direkt */
    if (specifier.endsWith(".vue") && specifier.startsWith(".")) {
        const vuePath = path.resolve(path.dirname(containingFile), specifier);
        return existsSync(vuePath) ? vuePath : null;
    }

    /* Låt TypeScript lösa sökvägen (relativt, index.ts, tsconfig paths etc.) */
    const resolved = ts.resolveModuleName(
        specifier,
        containingFile,
        compilerOptions,
        ts.sys,
    );

    const resolvedFileName = resolved.resolvedModule?.resolvedFileName;
    if (resolvedFileName && !resolved.resolvedModule.isExternalLibraryImport) {
        return path.resolve(resolvedFileName);
    }

    return null;
}
