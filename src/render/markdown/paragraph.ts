import type MarkdownIt from "markdown-it";

export function paragraph(): (md: MarkdownIt) => void {
    return function (md: MarkdownIt): void {
        /* eslint-disable camelcase -- property is defined in upstream library */
        md.renderer.rules.paragraph_open = () => `<p class="docs-paragraph">`;
        md.renderer.rules.paragraph_close = () => `</p>`;
        /* eslint-enable camelcase */
    };
}
