/* eslint-disable camelcase -- upstream library uses snake_case */
import type markdownIt from "markdown-it";
import { replaceAtLink } from "./utils";

type RenderRule = markdownIt.Renderer.RenderRule;

export function codeInline(): (md: markdownIt) => void {
    return function (md: markdownIt): void {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- will never be undefined
        const original = md.renderer.rules.code_inline!;
        md.renderer.rules.code_inline = (...args: Parameters<RenderRule>) => {
            const tmp = original(...args);
            return replaceAtLink(tmp);
        };
    };
}
