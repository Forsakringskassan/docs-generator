import { type Document } from "./document";
import { type DocumentPartial } from "./document-partial";

/**
 * @internal
 */
export function isDocumentPartial(doc: Document): doc is DocumentPartial {
    return doc.kind === "partial";
}
