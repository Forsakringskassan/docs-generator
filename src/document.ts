import { type DocumentOutline } from "./document-outline";

/**
 * @internal
 */
export interface DocumentAttributes {
    title?: string;
    layout?: string;

    /** sets the `name` property in `Document` */
    name?: string;

    /** component status */
    status?: string;

    /** visible in navigation */
    visible?: boolean;

    /** if should write to file and make available as a page */
    include?: boolean;

    /** component(s) this page corresponds to */
    component?: string | Component | Array<string | Component>;

    /** link to external page in navigation */
    href?: string;

    /** navigation sortorder */
    sortorder?: number;
}

/**
 * @public
 */
export type DocumentBadge = "success" | "error" | "info";

export interface Component {
    /** component name */
    name: string;
    /** optional hint (glob pattern) how to find the component */
    source?: string;
}

/**
 * @public
 */
export interface NormalizedDocumentAttributes {
    title?: string;
    layout?: string;
    status?: string;
    badge?: DocumentBadge;
    component?: Component[];
    href?: string;
    /** normalized sortorder (defaults to Infinity) */
    sortorder: number;
}

/**
 * @public
 */
export interface FileInfo {
    /** path relative to configured base */
    path: string;
    /** filename without extension */
    name: string;
    /** path relative to project root */
    fullPath: string;
    /**
     * Output filename or `false` to disable writing result to a file.
     *
     * When passing a filename these optional placeholders can be used:
     *
     * - `[hash]` - replaced with the hash of the content body.
     */
    outputName: string | false;
}

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

    body: string;

    /** Document outline (i.e. the heading structure) */
    outline: DocumentOutline;

    /** format of body */
    format: "markdown" | "html" | "json";

    /*' list of generic tags */
    tags: string[];

    template: string;

    fileInfo: FileInfo;
}
