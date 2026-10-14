import path from "node:path";
import { type Metafile } from "esbuild";

/**
 * @internal
 */
export interface ExtractedDependencies {
    /** Imports of each input file (absolute paths) */
    readonly files: Record<string, string[]>;

    /** Imports of the entry point (absolute paths) */
    readonly entry: string[];
}

function toFilePath(key: string, cwd: string): string {
    /* metafile keys for plugin namespaces looks like `namespace:path?query` */
    const stripped = key.replace(/^[a-z][\w-]+:/i, "").replace(/\?.*$/, "");
    return path.resolve(cwd, stripped);
}

function isDependency(filePath: string): boolean {
    return !filePath.split(path.sep).includes("node_modules");
}

/**
 * Extract file dependencies from an esbuild metafile.
 *
 * @internal
 * @param metafile - Metafile from esbuild.
 * @param cwd - Directory esbuild resolved paths in the metafile from.
 */
export function extractDependencies(
    metafile: Metafile,
    cwd: string,
): ExtractedDependencies {
    const entryKeys = new Set<string>();
    for (const output of Object.values(metafile.outputs)) {
        if (output.entryPoint) {
            entryKeys.add(output.entryPoint);
        }
    }

    const files = new Map<string, Set<string>>();
    let entry: string[] = [];
    for (const [key, input] of Object.entries(metafile.inputs)) {
        const imports = input.imports
            .filter((it) => !it.external)
            .map((it) => toFilePath(it.path, cwd))
            .filter((it) => isDependency(it));

        if (entryKeys.has(key)) {
            entry = Array.from(new Set(imports));
            continue;
        }

        /* one source file can be split into multiple inputs (e.g. `.vue`
         * files) so they are merged by file */
        const filePath = toFilePath(key, cwd);
        if (!isDependency(filePath)) {
            continue;
        }
        const set = files.get(filePath) ?? new Set<string>();
        for (const it of imports) {
            if (it !== filePath) {
                set.add(it);
            }
        }
        files.set(filePath, set);
    }

    return {
        files: Object.fromEntries(
            Array.from(files, ([file, deps]) => [file, Array.from(deps)]),
        ),
        entry,
    };
}
