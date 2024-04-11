import { type Document } from "../../document";

/**
 * Represents a handler for a `{@NAME CONTENT}` tag.
 *
 * Anatomy:
 *
 * ```
 *             /--- Inline tag
 * ~~~~~~~~~~~~~~~
 * {@NAME CONTENT}
 *   ~~~~ ~~~~~~~
 *     \     \----- Tag content
 *      \---------- Tag name
 * ```
 *
 * @internal
 */
export interface InlineTag {
    /**
     * The name to match, e.g. if set to `foo` this tag matches `{@foo ...}`
     */
    name: string;

    /**
     * For humans only and serves no other purpose.
     */
    description: string;

    /**
     * Handler for this tag. Must return a new string.
     *
     * @param doc - The current document being rendered.
     * @param docs - Document collection.
     * @param content - The tag content with leading and trailing whitespace trimmed.
     */
    handler(doc: Document, docs: Document[], content: string): string;
}
