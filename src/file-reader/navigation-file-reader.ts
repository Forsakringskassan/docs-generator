import fs from "node:fs/promises";
import path from "node:path";
import { type Document, type DocumentAttributes } from "../document";
import { normalizePath } from "../utils";

/**
 * @internal
 */
export function parseFile(
    filePath: string,
    basePath: string | undefined,
    content: string,
): Document {
    const attributes = JSON.parse(content) as DocumentAttributes;
    const { title, href } = attributes;

    if (!title) {
        throw new Error(`No title property set in "${filePath}"`);
    }

    const relative = basePath
        ? path.relative(basePath, normalizePath(filePath))
        : normalizePath(filePath);
    const parsed = path.parse(relative);
    const filename = parsed.name.toLowerCase();
    const name = parsed.name;
    const urlpath = parsed.dir;
    return {
        id: `nav:${filePath.replace(/\\/g, "/")}`,
        name,
        alias: [],
        visible: attributes.href ? true : false,
        attributes: {
            title,
            href,
            sortorder: attributes.sortorder ?? Infinity,
        },
        body: content,
        outline: [],
        format: "json",
        tags: [],
        template: "default",
        fileInfo: {
            path: ["", "."].includes(urlpath)
                ? "."
                : `./${normalizePath(urlpath)}`,
            name: filename,
            fullPath: normalizePath(filePath),
            outputName: false,
        },
    };
}

/**
 * Read a JSON file with arbitrary navigation entries.
 *
 * @public
 */
/* istanbul ignore next */
export async function navigationFileReader(
    filePath: string,
    basePath?: string,
): Promise<Document[]> {
    const content = await fs.readFile(filePath, "utf-8");
    const doc = parseFile(filePath, basePath, content);
    return [doc];
}
