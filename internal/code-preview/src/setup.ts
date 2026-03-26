import { CodePreviewElement } from "./code-preview";

export const tagName = "docs-code-preview";

/**
 * @public
 */
export function setup(): { tagName: string } {
    if (!customElements.get(tagName)) {
        customElements.define(tagName, CodePreviewElement);
    }

    return { tagName };
}
