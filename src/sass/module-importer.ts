import path from "node:path";
import { pathToFileURL } from "node:url";
import { type FileImporter } from "sass";

/**
 * @internal
 */
const WEBPACK_NODE_MODULE_PREFIX = "~";
export const moduleImporter: FileImporter = {
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
                const resolved = require.resolve(moduleName);
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
