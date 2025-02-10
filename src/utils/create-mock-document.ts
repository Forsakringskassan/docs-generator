import path from "node:path";
import { type DocumentPage } from "../document";

/**
 * For use with tests.
 *
 * @internal
 */
export function createMockDocument(
    name: string,
    filePath: string,
    doc?: Partial<DocumentPage>,
): DocumentPage {
    const parsed = path.parse(filePath);
    return {
        kind: "page",
        id: `mock:${name}`,
        name,
        alias: [],
        visible: false,
        attributes: {
            sortorder: Infinity,
            redirectFrom: [],
            ...doc?.attributes,
        },
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
