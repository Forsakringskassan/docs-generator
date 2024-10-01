import type MarkdownIt from "markdown-it";
import { type MarkdownEnv } from "../../markdown-env";

/**
 * @internal
 */
export type ContainerCallback = (
    tokens: MarkdownIt.Token[],
    index: number,
    options: MarkdownIt.Options,
    env: MarkdownEnv,
    self: MarkdownIt.Renderer,
) => string;
