import { type NormalizedDocumentAttributes } from "./document-attributes";
import { type DocumentOutline } from "./document-outline";
import { type FileInfo } from "./file-info";

/**
 * @public
 */
export interface Document {
    /** unique identifier for this document */
    id: string;

    /** human-readable pseudo-identifier for this document (consider it unique but there is no contraint enforcing this) */
    name: string;

    /** alternative names this document can be referenced by */
    alias: string[];

    /** true if document should be visible in menu and similar sources */
    visible: boolean;

    attributes: NormalizedDocumentAttributes;

    /** content of this document */
    body: string;

    /** Document outline (i.e. the heading structure) */
    outline: DocumentOutline;

    /** format of body */
    format: "markdown" | "html" | "json" | "redirect";

    /*' list of generic tags */
    tags: string[];

    template: string;

    fileInfo: FileInfo;
}
