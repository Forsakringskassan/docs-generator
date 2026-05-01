import { type Document } from "./document";
import { type DocumentPartialReference } from "./document-partial";

/**
 * Helper function to get document (partial) body.
 *
 * Returns static result if present or evaluates a dynamic body if a callback is
 * present.
 *
 * @internal
 */
export function getDocumentBody(
    document: Pick<Document, "body">,
    tags: string[],
    reference: DocumentPartialReference,
): string {
    return typeof document.body === "string"
        ? document.body
        : document.body(tags, reference);
}
