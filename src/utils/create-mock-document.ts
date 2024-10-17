import path from "node:path";
import { type Document } from "../document";

/**
 * For use with tests.
 *
 * @internal
 */
export function createMockDocument(
    name: string,
    filePath: string,
    doc?: Partial<Document>,
): Document {
    const parsed = path.parse(filePath);
    return {
        id: `mock:${name}`,
        name,
        alias: [],
        visible: false,
        attributes: { sortorder: Infinity, redirectFrom: [] },
        body: "",
        outline: [],
        format: "html",
        tags: [],
        template: "mock",
        fileInfo: {
            path: parsed.dir,
            name: parsed.name,
            fullPath: filePath,
            outputName: `${parsed.name}.html`,
        },
        ...doc,
    };
}
