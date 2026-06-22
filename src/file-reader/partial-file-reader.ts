import fs from "node:fs/promises";
import { type DocumentPartial } from "../document";

/**
 * @internal
 */
export interface PartialFile {
    id: string;
    format: "html" | "markdown" | "json";
    body: string;
}

/**
 * @internal
 */
export function parseFile(
    filePath: string,
    content: string,
): DocumentPartial[] {
    const parsed = JSON.parse(content) as PartialFile[];
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
 * Read partial documents for insertion in other markdown documents.
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
