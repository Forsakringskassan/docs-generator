/* eslint-disable camelcase -- property is defined in upstream library */
import { type MarkdownIt, type RendererRule } from "markdown-it";

export function paragraph(): (md: MarkdownIt) => void {
    return function (md: MarkdownIt): void {
        const original = md.renderer.rules.paragraph_open as
            RendererRule | undefined;
        md.renderer.rules.paragraph_open = (
            tokens,
            idx,
            options,
            env,
            self,
        ) => {
            tokens[idx].attrJoin("class", "docs-paragraph");
            if (original) {
                return original(tokens, idx, options, env, self);
            }
            return self.renderToken(tokens, idx, options);
        };
    };
}
