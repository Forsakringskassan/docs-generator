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
        const { document } = findDocument(docs, needle);

        if (document?.format === "markdown") {
            const body =
                typeof document.body === "string"
                    ? document.body
                    : document.body(tags);
            return md.render(body, env);
        }

        return md.render(token.content, env);
    };
}
