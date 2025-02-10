import { type Document } from "./document";
import { type DocumentPage } from "./document-page";

/**
 * @internal
 */
export function isDocumentPage(doc: Document): doc is DocumentPage {
    return doc.kind === "page";
}
