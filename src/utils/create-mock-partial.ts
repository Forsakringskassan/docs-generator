import { type DocumentPartial } from "../document";

/**
 * For use with tests.
 *
 * @internal
 */
export function createMockPartial(
    name: string,
    filePath: string,
    doc?: Partial<DocumentPartial>,
): DocumentPartial {
    return {
        kind: "partial",
        id: `mock:${name}`,
        name,
        alias: [],
        body: "",
        format: "html",
        fileInfo: {
            fullPath: filePath,
        },
        ...doc,
    };
}
