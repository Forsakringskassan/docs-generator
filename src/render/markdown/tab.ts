import { type ContainerCallback } from "./container/container-callback";
import { type ContainerContext } from "./container/container-context";

/**
 * Create a tab panel renderer.
 *
 * @internal
 */
export function tab(context: ContainerContext): ContainerCallback {
    const { md, env } = context;

    return (tokens, index) => {
        const token = tokens[index];
        const title = parseInfo(token.info);
        const text = token.content.trim();

        const titleSelector = parseCSSSelector(title);
        const tabPanelId = `tabpanel-${titleSelector}`;
        const tabId = `tab-${titleSelector}`;
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

function parseInfo(info: string | undefined): string {
    if (!info) {
        throw new Error("Missing tab title");
    }
    return info;
}

/**
 * Parses a text to appropriate CSS selector syntax with only small letters, numbers and `-`.
 */
function parseCSSSelector(toSelector: string): string {
    return toSelector
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll(/[^a-z0-9-]/g, "");
}
