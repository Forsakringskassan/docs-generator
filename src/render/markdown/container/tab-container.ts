import { type ContainerCallback } from "./container-callback";
import { type ContainerContext } from "./container-context";

/**
 * Create a container renderer "details" to render details (special variant of
 * messagebox).
 *
 * @internal
 */
export function tabContainer(
    context: ContainerContext,
    options: { title: Record<string, string | undefined> },
): ContainerCallback {
    const { md, env } = context;

    function parseInfo(info: string | undefined): string {
        const customTitle = info ? info.split(" ") : [];
        if (customTitle.length > 0) {
            return customTitle.join(" ");
        }
        return options.title.details ?? "Details";
    }

    return (tokens, index) => {
        const token = tokens[index];
        const title = parseInfo(token.info);
        const text = token.content.trim();
        return /* HTML */ `
            <div role="tab" class="docs-tab">
                <span>${md.renderInline(title, env)}</span>
                ${md.render(text, env)}
            </div>
        `;
    };
}
