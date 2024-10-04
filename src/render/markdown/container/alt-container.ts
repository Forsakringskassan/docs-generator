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
        const doc = findDocument(docs, needle);

        if (doc && doc.format === "markdown") {
            return md.render(doc.body, env);
        }

        return md.render(token.content, env);
    };
}
