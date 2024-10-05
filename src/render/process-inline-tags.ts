import { type Document } from "../document";
import { type InlineTag } from "./inline-tags";
import { SoftError, type SoftErrorType } from "./soft-error";

/**
 * @internal
 */
export function processInlineTags(
    tags: InlineTag[],
    doc: Document,
    docs: Document[],
    text: string,
    handleSoftError: (error: SoftErrorType) => string,
): string {
    return text.replace(
        /{@(@?)([^\s{}@]+)([^}]*)}/g,
        (_, escape, name, content) => {
            if (escape) {
                return `{@${name}${content}}`;
            }
            const tag = tags.find((it) => it.name === name);
            if (!tag) {
                return handleSoftError(
                    new SoftError(
                        "ETAGMISSING",
                        `No inline tag registered with the name "${name}"`,
                    ),
                );
            }
            try {
                return tag.handler(doc, docs, content.trim());
            } catch (err) {
                if (err instanceof SoftError) {
                    return handleSoftError(err);
                } else {
                    throw err;
                }
            }
        },
    );
}
