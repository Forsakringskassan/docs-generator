import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import Module from "node:module";
import { type FileImporter } from "sass";

declare module "node:module" {
    export function _resolveFilename(
        request: string,
        parent: { id: string; filename: string; paths: string[] },
    ): string;
    export function _nodeModulePaths(from: string): string[];
}

function resolveFrom(fromDirectory: string, moduleId: string): string {
    const fromFile = path.join(fs.realpathSync(fromDirectory), "noop.js");
    return Module._resolveFilename(moduleId, {
        id: fromFile,
        filename: fromFile,
        paths: Module._nodeModulePaths(fromDirectory),
    });
}

const WEBPACK_NODE_MODULE_PREFIX = "~";

/**
 * @internal
 */
export function moduleImporter(options: { cwd: string }): FileImporter {
    const { cwd } = options;
    return {
        findFileUrl(url) {
            let findUrl = url;
            if (url.startsWith(WEBPACK_NODE_MODULE_PREFIX)) {
                findUrl = url.substring(1);
            }

            const directory = path.dirname(findUrl);
            const fileName = path.basename(findUrl);

            const search = [
                `${fileName}.css`,
                `${fileName}.scss`,
                `_${fileName}.scss`,
                `${fileName}`,
            ];
            for (const variant of search) {
                try {
                    const moduleName = path.posix.join(directory, variant);
                    const resolved = resolveFrom(cwd, moduleName);
                    return new URL(pathToFileURL(resolved));
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no comment.
                } catch (err: any) {
                    if (err.code !== "MODULE_NOT_FOUND") {
                        throw err;
                    }
                }
            }
            return null;
        },
    };
}
