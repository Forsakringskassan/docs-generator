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
        const doc = findDocument(docs, needle);
        if (!doc) {
            return handleSoftError(
                new SoftError(
                    "EINCLUDETARGET",
                    `No document matches "${needle}" when trying to include content`,
                    { id: needle },
                ),
            );
        }

        /* @todo here we should instead detect the chain of includes to
         * provide a better explanation of *why* it happened, not just
         * *that* it happend */
        if (included.has(doc.id)) {
            return handleSoftError(
                new SoftError(
                    "EINCLUDERECURSION",
                    `Recursion detected when including document "${doc.id}"`,
                ),
            );
        }
        included.add(doc.id);

        if (doc.format === "html") {
            return doc.body.replace(
                /* replace `<next-heading-level>` and `</next-heading-level>` with actual h-tags */
                /(?<=<\/?)next-heading-level/g,
                `h${String(env.currentHeading + 1)}`,
            );
        }

        const content = md.render(doc.body, env);
        return /* HTML */ ` <div>${content}</div> `;
    };
}
