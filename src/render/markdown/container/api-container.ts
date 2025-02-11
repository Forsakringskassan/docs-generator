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
         * *that* it happened */
        const key = [doc.id, ...tags].join("|");
        const loop = included.get(doc.id);
        if (loop && loop !== context.doc.id) {
            return handleSoftError(
                new SoftError(
                    "EINCLUDERECURSION",
                    `Recursion detected when including document "${doc.id}"`,
                ),
            );
        }
        included.set(key, context.doc.id);

        const body = typeof doc.body === "string" ? doc.body : doc.body(tags);

        if (doc.format === "html") {
            return body.replace(
                /* replace `<next-heading-level>` and `</next-heading-level>` with actual h-tags */
                /(?<=<\/?)next-heading-level/g,
                `h${String(env.currentHeading + 1)}`,
            );
        }

        const markdown = body.replace(/^(#+) /gm, (m) => {
            const newLevel = m.length + env.currentHeading - 1;
            return `${"#".repeat(newLevel)} `;
        });
        return md.render(markdown, env);
    };
}
