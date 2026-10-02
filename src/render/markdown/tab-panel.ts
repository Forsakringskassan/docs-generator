import { type ContainerCallback } from "./container/container-callback";
import { type ContainerContext } from "./container/container-context";

/**
 * Create a tab panel renderer.
 *
 * @internal
 */
export function tabPanel(
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

        const id = "tabpanel-" + title.split(" ").join("-");
        const labelledBy = "tab-" + title.split(" ").join("-");
        return /* HTML */ `
            <div
                id="${id}"
                class="docs-tab hidden-tab"
                role="tabpanel"
                tabindex="0"
                aria-labelledby="${labelledBy}"
            >
                ${md.render(text, env)}
            </div>
        `;
    };
}
