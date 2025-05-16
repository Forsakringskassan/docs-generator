import dedent from "dedent";
import { normalizeLanguage } from "./normalize-language";

function removeLinesInline(
    lines: string[],
    { begin, end }: { begin: number; end: number },
): void {
    /* remove lines by blanking them (when the lines are later joined these
     * blank lines end up being nothing */
    for (let i = begin; i <= end; i++) {
        lines[i] = "";
    }

    /* if the previous line is just a blank line we remove that as well */
    if (lines[begin - 1] === "\n") {
        lines[begin - 1] = "";
        begin--;
    }

    /* if the next line is just a blank line we remove that as well */
    if (lines[end + 1] === "\n") {
        lines[end + 1] = "";
    }

    /* remove the trailing newline from the new last line or we end up with an
     * extra newline at the end of the string that wasn't there before */
    if (end === lines.length - 1 && begin > 0) {
        lines[begin - 1] = lines[begin - 1].slice(0, -1);
    }
}

function cutSnippets(code: string): string {
    const lines = code
        .split(/\n/)
        .map((it, index, lines) => (index < lines.length - 1 ? `${it}\n` : it));
    const directive =
        /(?:\/\* +--- +cut (?<js>above|below|begin|end) +--- +\*\/|<!---? +cut (?<html>above|below|begin|end) +---?>)/;

    let buffer = -1;
    lines.forEach((line, index) => {
        const match = line.match(directive);
        const { js, html } = match?.groups ?? { js: null, html: null };
        const instruction = js ?? html;
        if (!instruction) {
            return;
        }
        switch (instruction) {
            /* --- cut above --- */
            case "above":
                /* remove all lines above (including this one) */
                removeLinesInline(lines, {
                    begin: 0,
                    end: index,
                });
                break;
            /* --- cut below --- */
            case "below":
                /* remove all lines below (including this one) */
                removeLinesInline(lines, {
                    begin: index,
                    end: lines.length - 1,
                });
                break;
            /* --- cut begin --- */
            case "begin":
                /* here we only hold on to the line number until we
                 * encounter the end instruction */
                if (buffer === -1) {
                    buffer = index;
                }
                break;
            /* --- cut end --- */
            case "end":
                removeLinesInline(lines, {
                    begin: Math.max(buffer, 0),
                    end: index,
                });
                buffer = -1;
                break;
            default:
                break;
        }
    });

    /* if cut begin was used without end we still have the line number buffered
     * and should interpret it as cut below, i.e. we remove all lines from begin
     * and down */
    if (buffer >= 0) {
        removeLinesInline(lines, {
            begin: buffer,
            end: lines.length - 1,
        });
    }

    return lines.join("");
}

function stripEslintComments(code: string): string {
    /* matches an eslint comment occupying the whole line (entire line including
     * newline is removed) */
    const matchLine =
        /^[ \t]*(\/\* eslint-disable[^*]*\*\/|\/\/ eslint-disable.*)\n/gm;

    /* matches an eslint comment embedded with other statements (only the
     * commend and whitespace before it is removed) */
    const matchEmbedded =
        /[ \t]*(\/\* eslint-disable[^*]*\*\/|\/\/ eslint-disable.*)/g;

    return code.replace(matchLine, "").replace(matchEmbedded, "");
}

function stripHtmlValidateComments(code: string): string {
    /* matches an html-validate comment occupying the whole line (entire line
     * including newline is removed) */
    const matchLine = /^[ \t]*(<!--\s*\[html-validate-[^\]]+]\s*-->)\n/gm;

    /* matches an html-validate comment embedded with other elements (only the
     * commend and whitespace before it is removed) */
    const matchEmbedded = /[ \t]*(<!--\s*\[html-validate-[^\]]+]\s*-->)/g;

    return code.replace(matchLine, "").replace(matchEmbedded, "");
}

function maybeDedent(value: string): string {
    /* if the string is only whitespace we preserve it exactly as is */
    if (/^\s*$/.test(value)) {
        return value;
    }

    /* Conditionally calling dedent due to
     * https://github.com/dmnd/dedent/issues/20
     *
     * - If the first line is indented we dedent the string as usual.
     *
     * - If the first line is not indented the dedention should be a no-op as
     *   the indentation level is zero already but the referenced bug causes
     *   `dedent` to pick up any other indented line as basis for the current
     *   indentation level and thus removes to much.
     *
     * Consider the following input:
     *
     * ```
     * function foo() {
     *     return "...";
     * }
     * ```
     *
     * The expected output is the same as the input.
     */
    if (/^\s/.test(value)) {
        return dedent(value);
    } else {
        return value;
    }
}

/* transformations to apply based on language, transforms are run from left to right */
const transformations: Record<string, Array<(code: string) => string>> = {
    html: [cutSnippets, stripHtmlValidateComments, maybeDedent],
    vue: [cutSnippets, stripHtmlValidateComments, maybeDedent],
    javascript: [cutSnippets, stripEslintComments, maybeDedent],
    typescript: [cutSnippets, stripEslintComments, maybeDedent],
};

export function transformCode(code: string, lang: string): string {
    const normalizedLanguage = normalizeLanguage(lang);
    const fns = transformations[normalizedLanguage] ?? [];
    for (const fn of fns) {
        code = fn(code);
    }
    return code;
}
