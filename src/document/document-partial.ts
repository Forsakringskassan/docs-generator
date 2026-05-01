/**
 * Reference used when including a partial.
 *
 * @public
 */
export interface DocumentPartialReference {
    /** the type of identifier used to include this partial */
    kind: "id" | "name" | "alias";
    /** the identifier used to include this partial */
    reference: string;
}

/**
 * A partial document for inclusion in other documents.
 *
 * A partial document will never have an output file and only a limited number
 * of parameters.
 *
 * @public
 */
export interface DocumentPartial {
    /** discriminator */
    kind: "partial";

    /** unique identifier for this document */
    id: string;

    /** human-readable pseudo-identifier for this document (consider it unique but there is no contraint enforcing this) */
    name: string;

    /** alternative names this document can be referenced by */
    alias: string[];

    /**
     * Content of this document
     *
     * @param tags - List of tags given when including this partial.
     * @param reference - Reference used when importing this partial.
     */
    body:
        | string
        | ((tags: string[], reference: DocumentPartialReference) => string);

    /** format of body */
    format: "markdown" | "html" | "json";

    fileInfo: {
        /** original source of this document, if available */
        fullPath: string | undefined;
    };
}
