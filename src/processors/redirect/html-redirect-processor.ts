import fs from "node:fs/promises";
import path from "node:path/posix";
import dedent from "dedent";
import { type Processor } from "../../processor";
import { getOutputFilePath, haveOutput } from "../../utils";
import { relative } from "../../render/filter";

const template = (dst: string): string => /* HTML */ `
    <!doctype html>
    <html lang="en">
        <head>
            <title>Redirect</title>
            <meta http-equiv="refresh" content="0; url=${dst}" />
        </head>
        <body>
            <p>
                This page has moved to
                <a href="${dst}"> ${dst} </a>.
            </p>
        </body>
    </html>
`;

/**
 * Creates redirects using html-files with meta redirects.
 *
 * @public
 */
export function htmlRedirectProcessor(): Processor {
    return {
        name: "html-redirect-processor",
        after: "render",
        async handler(context) {
            const { docs, outputFolder } = context;
            for (const doc of docs.filter(haveOutput)) {
                if (doc.format !== "redirect") {
                    continue;
                }
                const filePath = getOutputFilePath(outputFolder, doc.fileInfo);
                const dst = relative(doc.body, doc);
                const content = template(dst);
                await fs.mkdir(path.dirname(filePath), { recursive: true });
                await fs.writeFile(filePath, dedent(content), "utf-8");
            }
        },
    };
}
