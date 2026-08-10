import { fileURLToPath } from "node:url";
import { type Plugin } from "esbuild";
import { resolve } from "import-meta-resolve";

const pluginName = "docs:dependency-tracker";

export function dependencyTrackerPlugin(dependencies: Set<string>): Plugin {
    return {
        name: pluginName,
        setup(build) {
            build.onResolve({ filter: /^[^.].*/ }, (arg) => {
                try {
                    const from = `file://${arg.resolveDir}/noop.js`;
                    const resolved = resolve(arg.path, from);
                    const filePath = fileURLToPath(resolved);
                    dependencies.add(filePath);
                } catch {
                    /* do nothing */
                }
                return null;
            });
            build.onLoad({ filter: /.*/, namespace: "file" }, (arg) => {
                dependencies.add(arg.path);
                return null;
            });
        },
    };
}
