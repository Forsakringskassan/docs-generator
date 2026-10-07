import {
    type MarkdownIt,
    type RendererRule,
    type StateBlock,
} from "markdown-it";
import { type Document } from "../../document";
import { type MarkdownEnv } from "../markdown-env";
import { type SoftErrorType } from "../soft-error";
import { type ContainerContext } from "./container";
import { tabPanel } from "./tab-panel";

const markerStr = "§";
const markerChar = markerStr.codePointAt(0);

function tabs(
    state: StateBlock,
    startLine: number,
    endLine: number,
    silent: boolean,
): boolean {
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
    }

    /// control that we have at least three characters
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];
    if (pos + 3 > max) {
        return false;
    }

    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- pos will always be positive */
    const marker = state.src.codePointAt(pos)!;

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

    // Since start is found, we can report success here in validation mode
    if (silent) {
        return true;
    }

    const markup = state.src.slice(mem, pos);
    const tabName = state.src.slice(pos, max).trim();

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

        if (state.src.codePointAt(pos) !== marker) {
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
            // found another tab
            break;
        }

        haveEndMarker = true;
        // found!
        break;
    }

    // If a fence has heading spaces, they should be removed from its inner block
    len = state.sCount[startLine];

    // Only move to next line when all tabs are done (have an end marker)
    state.line = nextLine + (haveEndMarker ? 1 : 0);

    const token = state.push(`doc_tab`, "div", 0);
    token.info = tabName;
    token.content = state.getLines(startLine + 1, nextLine, len, true);
    token.markup = markup;
    token.map = [startLine, state.line];

    return true;
}

/* eslint-disable-next-line @typescript-eslint/max-params -- technical debt: should create and interface or similar */
export function tabsRenderer(
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

        md.block.ruler.before("container_include", "tabs_include", tabs, {
            alt: ["paragraph", "reference", "blockquote", "list"],
        });

        md.renderer.rules[`doc_tab`] = tabPanel(
            context,
            options.messagebox,
        ) as RendererRule;
    };
}
