import { type ContainerCallback } from "./container/container-callback";
import { type ContainerContext } from "./container/container-context";

/**
 * Create a tab panel renderer.
 *
 * @internal
 */
export function tab(
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

        const tabPanelId = `tabpanel-${title.replaceAll(" ", "-")}`;
        const tabId = `tab-${title.replaceAll(" ", "-")}`;
        return /* HTML */ `
            <button
                id="${tabId}"
                class="docs-tab"
                role="tab"
                type="button"
                aria-selected="false"
                aria-controls="${tabPanelId}"
                tabindex="-1"
            >
                ${title}
            </button>
            <div
                id="${tabPanelId}"
                class="docs-tabpanel hidden-tabpanel"
                role="tabpanel"
                tabindex="0"
                aria-labelledby="${tabId}"
            >
                ${md.render(text, env)}
            </div>
        `;
    };
}
