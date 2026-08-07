import { type MarkdownItOptions, type Renderer, type Token } from "markdown-it";
import { type MarkdownEnv } from "../../markdown-env";

/**
 * @internal
 */
export type ContainerCallback = (
    tokens: Token[],
    index: number,
    options: MarkdownItOptions,
    env: MarkdownEnv,
    self: Renderer,
) => string;
