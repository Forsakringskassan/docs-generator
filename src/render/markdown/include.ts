import type MarkdownIt from "markdown-it";
import { type Document } from "../../document";
import { findDocument } from "../../utils/find-document";
import { MarkdownEnv } from "../markdown-env";
import { type SoftErrorType, SoftError } from "../soft-error";

type RenderCallback = (
    tokens: MarkdownIt.Token[],
    index: number,
    options: MarkdownIt.Options,
    env: MarkdownEnv,
    self: MarkdownIt.Renderer,
) => string;

type Options = Record<string, RenderCallback>;

const markerStr = ":";
const markerChar = markerStr.charCodeAt(0);

function parser(md: MarkdownIt, options: Options): void {
    function container(
        state: MarkdownIt.StateBlock,
        startLine: number,
        endLine: number,
        silent: boolean,
    ): boolean {
        let pos = state.bMarks[startLine] + state.tShift[startLine];
        let max = state.eMarks[startLine];

        // if it's indented more than 3 spaces, it should be a code block
        if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
        }

        if (pos + 3 > max) {
            return false;
        }

        const marker = state.src.charCodeAt(pos);

        if (marker !== markerChar) {
            return false;
        }

        // scan marker length
        let mem = pos;
        pos = state.skipChars(pos, marker);

        let len = pos - mem;

        if (len < 3) {
            return false;
        }

        const markup = state.src.slice(mem, pos);
        const params = state.src.slice(pos, max).trim();
        const kind = params.split(" ", 2)[0];

        // Since start is found, we can report success here in validation mode
        if (silent) {
            return true;
        }

        // search end of block
        let nextLine = startLine;
        let haveEndMarker = false;

        for (;;) {
            nextLine++;
            if (nextLine >= endLine) {
                // unclosed block should be autoclosed by end of document.
                // also block seems to be autoclosed by end of parent
                break;
            }

            pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];

            if (pos < max && state.sCount[nextLine] < state.blkIndent) {
                // non-empty line with negative indent should stop the list:
                // - ```
                //  test
                break;
            }

            if (state.src.charCodeAt(pos) !== marker) {
                continue;
            }

            if (state.sCount[nextLine] - state.blkIndent >= 4) {
                // closing fence should be indented less than 4 spaces
                continue;
            }

            pos = state.skipChars(pos, marker);

            // closing code fence must be at least as long as the opening one
            if (pos - mem < len) {
                continue;
            }

            // make sure tail has spaces only
            pos = state.skipSpaces(pos);

            if (pos < max) {
                continue;
            }

            haveEndMarker = true;
            // found!
            break;
        }

        // If a fence has heading spaces, they should be removed from its inner block
        len = state.sCount[startLine];

        state.line = nextLine + (haveEndMarker ? 1 : 0);

        const token = state.push(`doc_${kind}`, "div", 0);
        token.info = params;
        token.content = state.getLines(startLine + 1, nextLine, len, true);
        token.markup = markup;
        token.map = [startLine, state.line];

        return true;
    }

    md.block.ruler.before("fence", "container_include", container, {
        alt: ["paragraph", "reference", "blockquote", "list"],
    });

    for (const [kind, fn] of Object.entries(options)) {
        md.renderer.rules[`doc_${kind}`] = fn;
    }
}

export function include(
    docs: Document[],
    env: MarkdownEnv,
    included: Set<string>,
    handleSoftError: (error: SoftErrorType) => string,
): (md: MarkdownIt) => void {
    return function (md: MarkdownIt): void {
        md.use(parser, {
            api(tokens: MarkdownIt.Token[], index: number) {
                const token = tokens[index];
                const needle = token.content.trim();
                const doc = findDocument(docs, needle);
                if (!doc) {
                    return handleSoftError(
                        new SoftError(
                            "EINCLUDETARGET",
                            `No document matches "${needle}" when trying to include content`,
                            { id: needle },
                        ),
                    );
                }

                /* @todo here we should instead detect the chain of includes to
                 * provide a better explanation of *why* it happened, not just
                 * *that* it happend */
                if (included.has(doc.id)) {
                    return handleSoftError(
                        new SoftError(
                            "EINCLUDERECURSION",
                            `Recursion detected when including document "${doc.id}"`,
                        ),
                    );
                }
                included.add(doc.id);

                if (doc.format === "html") {
                    return doc.body;
                }

                const content = md.render(doc.body, env);
                return /* HTML */ ` <div>${content}</div> `;
            },
        });
    };
}
