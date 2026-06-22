import fs from "node:fs/promises";
import { type DocumentPartial } from "../document";

/**
 * @internal
 */
export function parseFile(
    filePath: string,
    content: string,
): DocumentPartial[] {
    const parsed = JSON.parse(content) as Array<{
        id: string;
        format: "html" | "markdown" | "json";
        body: string;
    }>;
    return parsed.map((it): DocumentPartial => {
        return {
            kind: "partial",
            id: it.id,
            name: it.id,
            alias: [],
            body: it.body,
            format: it.format,
            fileInfo: {
                fullPath: filePath,
            },
        };
    });
}

/**
 * Read partial documents extracted from `extractMarkdownProcessor`.
 *
 * @public
 */
/* istanbul ignore next */
export async function partialFileReader(
    filePath: string,
): Promise<DocumentPartial[]> {
    const content = await fs.readFile(filePath, "utf8");
    return parseFile(filePath, content);
}
