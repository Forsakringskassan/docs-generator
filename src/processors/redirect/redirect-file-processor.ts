import fs from "node:fs/promises";
import path from "node:path/posix";
import { type Processor } from "../../processor";
import { type Document } from "../../document";
import { haveOutput, normalizePath } from "../../utils";

function isRedirect(doc: Document): boolean {
    return doc.format === "redirect";
}

/**
 * Generate a netlify-style `_redirects` file.
 *
 * @public
 * @param prefix - Prefix to append to all urls, set to subdirectory if you're deploying to a subdirectory.
 * @param filename - Output filename (relative to output folder).
 */
export function redirectFileProcessor(
    prefix: string = "/",
    filename: string = "_redirects",
): Processor {
    return {
        name: "redirect-file-processor",
        after: "render",
        async handler(context) {
            const { docs } = context;
            const lines = docs
                .filter(haveOutput)
                .filter(isRedirect)
                .map((doc) => {
                    const src = normalizePath(
                        doc.fileInfo.path,
                        doc.fileInfo.outputName,
                    );
                    const dst = doc.body;
                    return `${prefix}${src} ${prefix}${dst} 301\n`;
                });
            const filePath = path.join(context.outputFolder, filename);
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, lines.join(""), "utf-8");
            context.log(filename, "generated");
        },
    };
}
