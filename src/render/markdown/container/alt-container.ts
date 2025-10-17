import { findDocument } from "../../../utils/find-document";
import { type ContainerCallback } from "./container-callback";
import { type ContainerContext } from "./container-context";

/**
 * Create a container renderer "alt" to render alternative texts.
 *
 * @internal
 */
export function altContainer(context: ContainerContext): ContainerCallback {
    const { md, env, docs } = context;
    return (tokens, index) => {
        const token = tokens[index];
        const needle = token.info;
        const tags = token.info.trim().split(/\s+/);
        const doc = findDocument(docs, needle);

        if (doc?.format === "markdown") {
            const body =
                typeof doc.body === "string" ? doc.body : doc.body(tags);
            return md.render(body, env);
        }

        return md.render(token.content, env);
    };
}
