import type MarkdownIt from "markdown-it";
import { type Document } from "../../document";
import { type MarkdownEnv } from "../markdown-env";
import { type SoftErrorType } from "../soft-error";
import {
    type ContainerCallback,
    type ContainerContext,
    altContainer,
    apiContainer,
    detailsContainer,
    messageboxContainer,
} from "./container";

type Options = Record<string, ContainerCallback>;

const markerStr = ":";
const markerChar = markerStr.charCodeAt(0);

/**
 * @internal
 */
export function containerParser(md: MarkdownIt, options: Options): void {
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
        const params = state.src.slice(pos, max).trim().split(/\s+/);
        const kind = params[0];
        const info = params.slice(1).join(" ");

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
        token.info = info?.trim();
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

/* eslint-disable-next-line @typescript-eslint/max-params -- technical debt: should create and interface or similar */
export function containerRenderer(
    doc: () => Document,
    docs: Document[],
    env: MarkdownEnv,
    included: Map<string, string>,
    handleSoftError: (error: SoftErrorType) => string,
    options: {
        messagebox: {
            title: Record<string, string>;
        };
    },
): (md: MarkdownIt) => void {
    return function (md: MarkdownIt): void {
        const context: ContainerContext = {
            md,
            env,
            get doc() {
                return doc();
            },
            docs,
            included,
            handleSoftError,
        };
        md.use(containerParser, {
            alt: altContainer(context),
            api: apiContainer(context),
            details: detailsContainer(context, options.messagebox),
            messagebox: messageboxContainer(context, options.messagebox),

            /* aliases for messagebox containers */
            info: messageboxContainer(context, options.messagebox, "info"),
            tip: messageboxContainer(context, options.messagebox, "tip"),
            warning: messageboxContainer(
                context,
                options.messagebox,
                "warning",
            ),
            danger: messageboxContainer(context, options.messagebox, "danger"),
        });
    };
}
