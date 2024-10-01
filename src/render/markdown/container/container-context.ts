import type MarkdownIt from "markdown-it";
import { type Document } from "../../../document";
import { type MarkdownEnv } from "../../markdown-env";
import { type SoftErrorType } from "../../soft-error";

/**
 * @internal
 */
export interface ContainerContext {
    /**
     * Current markdown renderer.
     */
    md: MarkdownIt;

    /**
     * Current markdown environment.
     */
    env: MarkdownEnv;

    /**
     * List of all available documents.
     */
    docs: Document[];

    /**
     * A set of doucment ids which has been processed during this cycle. If the
     * block handles recursive content (e.g. including content from other
     * documents) the current document it should always be compared to this to
     * prevent infinite loops.
     */
    included: Set<string>;

    /**
     * Called to handle a soft error, i.e. an error that we can recover
     * from. The implementation of this will decide what should happen and can
     * return a HTML-string with replacement content (or stop processing by
     * rethrowing the exception).
     */
    handleSoftError(error: SoftErrorType): string;
}
