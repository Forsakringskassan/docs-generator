import { type Document } from "../document";

/**
 * @internal
 */
export type FindDocumentResult =
    | { document: Document; kind: "id" | "name" | "alias"; reference: string }
    | { document: null; kind: null; reference: null };

/**
 * Find a document by id, name or alias.
 *
 * In case multiple document matches the "first" match is returned but the order
 * is in no way guaranteed so results may change over time.
 *
 * @internal
 * @param haystack - All available documents.
 * @param needle - What to search for.
 * @returns Matching document or `null` if no document matches.
 */
export function findDocument(
    haystack: Document[],
    needle: string,
): FindDocumentResult {
    for (const document of haystack) {
        if (document.id === needle) {
            return { document, kind: "id", reference: needle };
        }
        if (document.name === needle) {
            return { document, kind: "name", reference: needle };
        }
        if (document.alias.includes(needle)) {
            return { document, kind: "alias", reference: needle };
        }
    }
    return { document: null, kind: null, reference: null };
}
