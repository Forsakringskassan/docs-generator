/**
 * Represents a single heading (and its subheadings) in a document outline.
 *
 * @public
 */
export interface DocumentOutlineEntry {
    /** Heading title */
    title: string;

    /** Heading rank, e.g. `##` (h2) is rank 2 */
    rank: number;

    /** Heading anchor (id or name attribute) */
    anchor: string;

    /** Subheadings */
    subheadings: DocumentOutline;
}

/**
 * Represents a document outline (i.e. the heading structure).
 *
 * @public
 */
export type DocumentOutline = DocumentOutlineEntry[];
