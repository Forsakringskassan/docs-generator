import { type ContainerCallback } from "./container-callback";
import { type ContainerContext } from "./container-context";

/**
 * Create a container renderer "details" to render details (special variant of
 * messagebox).
 *
 * @internal
 */
export function tabsContainer(context: ContainerContext): ContainerCallback {
    const { md, env } = context;

    return (tokens, index) => {
        const token = tokens[index];
        const text = token.content.trim();
        return /* HTML */ `
            <div role="tablist" class="docs-tabs">${md.render(text, env)}</div>
        `;
    };
}
