import path from "node:path/posix";
import { readFile } from "fs/promises";
import { type Plugin } from "esbuild";

const pluginName = "fk:raw-import";

export function rawImportPlugin(): Plugin {
    return {
        name: pluginName,
        setup(build) {
            build.onResolve({ filter: /\?raw$/ }, (args) => {
                return {
                    path: args.path,
                    pluginData: {
                        isAbsolute: path.isAbsolute(args.path),
                        resolveDir: args.resolveDir,
                    },
                    namespace: pluginName,
                };
            });
            build.onLoad(
                { filter: /\?raw$/, namespace: pluginName },
                async (args) => {
                    const fullPath = args.pluginData.isAbsolute
                        ? args.path
                        : path.join(args.pluginData.resolveDir, args.path);
                    return {
                        contents: await readFile(
                            fullPath.replace(/\?raw$/, ""),
                        ),
                        loader: "text",
                    };
                },
            );
        },
    };
}
