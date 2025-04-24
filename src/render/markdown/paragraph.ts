import type MarkdownIt from "markdown-it";

export function paragraph(): (md: MarkdownIt) => void {
    const renderToken: MarkdownIt.Renderer.RenderRule = (...args) => {
        const [tokens, idx, options, , self] = args;
        return self.renderToken(tokens, idx, options);
    };

    return function (md: MarkdownIt): void {
        /* eslint-disable camelcase -- property is defined in upstream library */
        const renderRule = md.renderer.rules.paragraph_open ?? renderToken;
        md.renderer.rules.paragraph_open = (tokens, idx, index, env, self) => {
            tokens[idx].attrJoin("class", "docs-paragraph");
            return renderRule(tokens, idx, index, env, self);
        };
        /* eslint-enable camelcase */
    };
}
