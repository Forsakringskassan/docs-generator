import { type ContainerCallback } from "./container-callback";
import { type ContainerContext } from "./container-context";

const defaultTitle: Record<string, string> = {
    info: "INFO",
    tip: "TIP",
    warning: "WARNING",
    danger: "DANGER",
};

/**
 * Create a container renderer "messagebox" to render messageboxes.
 *
 * @internal
 * @param alias - If specified it creates a messagebox renderer only for given variant.
 */
export function messageboxContainer(
    context: ContainerContext,
    options: { title: Record<string, string> },
    alias?: string,
): ContainerCallback {
    const { md, env } = context;

    function getTitle(
        variant: string,
        customTitle: string[] | undefined,
    ): string {
        if (customTitle && customTitle.length > 0) {
            return customTitle.join(" ");
        } else {
            return options.title[variant] ?? defaultTitle[variant] ?? "";
        }
    }

    function parseInfo(info: string | undefined): {
        variant: string;
        title: string;
    } {
        if (alias) {
            const variant = alias;
            const customTitle = info ? info.split(" ") : [];
            const title = getTitle(variant, customTitle);
            return { variant, title };
        } else {
            const [variant = "info", ...customTitle] = info
                ? info.split(" ")
                : [];
            const title = getTitle(variant, customTitle);
            return { variant, title };
        }
    }

    return (tokens, index) => {
        const token = tokens[index];
        const { variant, title } = parseInfo(token.info);
        const text = token.content.trim();
        const content = md.render(text, env);
        return /* HTML */ `
            <div class="docs-messagebox docs-messagebox--${variant}">
                ${title ? `<p class="docs-messagebox__title">${title}</p>` : ""}
                ${content}
            </div>
        `;
    };
}
