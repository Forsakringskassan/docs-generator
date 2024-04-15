import path from "node:path/posix";
import crypto from "node:crypto";
import type MarkdownIt from "markdown-it";
import { type FileInfo } from "../../document";
import { type MarkdownEnv } from "../markdown-env";

function computeHash(source: string): string {
    return crypto.createHash("md5").update(source).digest("hex");
}

function getFilename(fileInfo: FileInfo, src: string): string {
    const key = [fileInfo.fullPath, src].join("-");
    const hash = computeHash(key);
    const { ext } = path.parse(src);
    return `images/${hash}${ext}`;
}

export function imageResources(options: {
    addResource(dst: string, src: string): void;
}): (md: MarkdownIt) => void {
    const { addResource } = options;
    function imageResource(
        tokens: MarkdownIt.Token[],
        index: number,
        options: MarkdownIt.Options,
        env: MarkdownEnv,
        self: MarkdownIt.Renderer,
    ): string {
        const { fileInfo } = env;
        const token = tokens[index];

        token.attrs ??= [];

        /* copy image asset into the `assets/images` directory and rewrite the url to match */
        const srcAttr = token.attrGet("src");
        if (srcAttr) {
            const dst = getFilename(fileInfo, srcAttr);
            const src = path.join(path.dirname(fileInfo.fullPath), srcAttr);
            const url = path.relative(fileInfo.path, path.join("assets", dst));

            addResource(dst, src);
            token.attrs[token.attrIndex("src")][1] = url;
        }

        /* from upstream original image renderer, sets the alt attribute */
        token.attrs[token.attrIndex("alt")][1] = self.renderInlineAsText(
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- from upstream code */
            token.children!,
            options,
            env,
        );

        return self.renderToken(tokens, index, options);
    }

    return function (md: MarkdownIt): void {
        md.renderer.rules.image = imageResource;
    };
}
