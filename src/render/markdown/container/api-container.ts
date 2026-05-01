import { findDocument } from "../../../utils/find-document";
import { SoftError } from "../../soft-error";
import { type ContainerCallback } from "./container-callback";
import { type ContainerContext } from "./container-context";

/**
 * Create a container renderer "api" to render API documentation.
 *
 * @internal
 */
export function apiContainer(context: ContainerContext): ContainerCallback {
    const { md, env, docs, included, handleSoftError } = context;
    return (tokens, index) => {
        const token = tokens[index];
        const needle = token.content.trim();
        const tags = token.info.trim().split(/\s+/);
        const result = findDocument(docs, needle);
        if (!result.document) {
            return handleSoftError(
                new SoftError(
                    "EINCLUDETARGET",
                    `No document matches "${needle}" when trying to include content`,
                    { id: needle },
                ),
            );
        }

        const { document, kind, reference } = result;

        /* @todo here we should instead detect the chain of includes to
         * provide a better explanation of *why* it happened, not just
         * *that* it happened */
        const key = [document.id, ...tags].join("|");
        const loop = included.get(document.id);
        if (loop && loop !== context.doc.id) {
            return handleSoftError(
                new SoftError(
                    "EINCLUDERECURSION",
                    `Recursion detected when including document "${document.id}"`,
                ),
            );
        }
        included.set(key, context.doc.id);

        const body =
            typeof document.body === "string"
                ? document.body
                : document.body(tags, { kind, reference });

        if (document.format === "html") {
            const { currentHeading } = env;
            const nextHeadingLevel = currentHeading + 1;
            return body.replaceAll(
                /* replace `<next-heading-level>` and `</next-heading-level>` with actual h-tags */
                /<(\/?)next-heading-level/g,
                (_, slash: string) =>
                    slash
                        ? `</h${String(nextHeadingLevel)}`
                        : /* technical debt: this will fail if classes are being set on <next-heading-level tags */
                          `<h${String(nextHeadingLevel)} class="docs-heading docs-heading--h${String(nextHeadingLevel)}"`,
            );
        }

        const content = md.render(body, env);
        return /* HTML */ ` <div>${content}</div> `;
    };
}
