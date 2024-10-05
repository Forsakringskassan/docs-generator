import { type InlineTag } from "./inline-tag";

export const optionalTag: InlineTag = {
    name: "optional",
    description: "Create a tag for symbolize optional content",
    handler() {
        return `<span class="docs-tag docs-tag--default">Optional</span>`;
    },
};
