import type { Options } from "markdown-it";
import type Renderer from "markdown-it/lib/renderer.mjs";
import type Token from "markdown-it/lib/token.mjs";
import { type MarkdownEnv } from "../../markdown-env";

/**
 * @internal
 */
export type ContainerCallback = (
    tokens: Token[],
    index: number,
    options: Options,
    env: MarkdownEnv,
    self: Renderer,
) => string;
