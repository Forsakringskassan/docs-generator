import type MarkdownIt from "markdown-it";
import { generateId } from "../../utils/generate-id";
import { type MarkdownEnv } from "../markdown-env";

function getTokensText(tokens: MarkdownIt.Token[]): string {
    return tokens
        .filter((token) => ["text", "code_inline"].includes(token.type))
        .map((token) => token.content)
        .join("");
}

export function headingLevel(options: {
    initialLevel: number;
}): (md: MarkdownIt) => void {
    const { initialLevel } = options;
    const offset = initialLevel - 1;
    let counter = 1;
    return function (md: MarkdownIt): void {
        /* eslint-disable-next-line camelcase -- upstream library uses snake_case */
        md.renderer.rules.heading_open = function (
            tokens,
            idx,
            _options,
            env: MarkdownEnv,
        ) {
            const { ids } = env;
            const { tag } = tokens[idx];
            const title = getTokensText(tokens[idx + 1]?.children ?? []);
            let id = generateId(title);

            /* handles duplicate id's */
            if (ids.has(id)) {
                id += `--${counter++}`;
            }

            ids.add(id);

            return tag.replace(/h(\d)/, (_, n: string) => {
                const level = parseInt(n, 10) + offset;
                return `<h${level} id="${id}"><a class="header-anchor" href="#${id}">`;
            });
        };
        /* eslint-disable-next-line camelcase -- upstream library uses snake_case */
        md.renderer.rules.heading_close = function (tokens, idx) {
            const { tag } = tokens[idx];
            return tag.replace(/h(\d)/, (_, n: string) => {
                const level = parseInt(n, 10) + offset;
                return `</a></h${level}>`;
            });
        };
    };
}
