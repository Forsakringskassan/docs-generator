import path from "node:path/posix";
import { type Plugin } from "esbuild";

const pluginName = "virtual-entry";

export type VirtualEntries = Record<string, string>;

export function isVirtualEntrypoint(value: string): boolean {
    return value.startsWith(`${pluginName}:`);
}

export function virtualEntryPlugin(entries: VirtualEntries): Plugin {
    function haveEntry(key: string): boolean {
        return Boolean(entries[key]);
    }

    function getEntry(key: string): string {
        return entries[key];
    }

    return {
        name: pluginName,
        setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
                if (args.kind === "entry-point" && haveEntry(args.path)) {
                    return {
                        path: args.path,
                        namespace: pluginName,
                    };
                } else {
                    return undefined;
                }
            });
            build.onLoad({ filter: /.*/, namespace: pluginName }, (args) => {
                /* args.path is "virtual:${sourceFile}:${outputFile}" */
                const [, resolveFrom] = args.path.split(":");
                const contents = getEntry(args.path);
                return {
                    contents,
                    loader: "ts",
                    resolveDir: path.dirname(resolveFrom),
                };
            });
        },
    };
}
