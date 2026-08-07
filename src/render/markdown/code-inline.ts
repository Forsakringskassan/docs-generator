/* eslint-disable camelcase -- upstream library uses snake_case */
import { type MarkdownIt, type RendererRule } from "markdown-it";
import { replaceAtLink } from "./utils";

export function codeInline(): (md: MarkdownIt) => void {
    return function (md: MarkdownIt): void {
        const original = md.renderer.rules.code_inline;
        md.renderer.rules.code_inline = (...args: Parameters<RendererRule>) => {
            const tmp = original(...args);
            return replaceAtLink(tmp);
        };
    };
}
