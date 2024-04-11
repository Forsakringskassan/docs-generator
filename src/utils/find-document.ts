import { type Document } from "../document";

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
): Document | null {
    const match = haystack.find((it) => {
        if (it.id === needle) {
            return true;
        }
        if (it.name === needle) {
            return true;
        }
        if (it.alias.includes(needle)) {
            return true;
        }
        return false;
    });
    return match ?? null;
}
