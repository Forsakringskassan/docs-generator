/**
 * A single block tag, e.g. `@deprecated Use foo instead` becomes
 * `{ name: "deprecated", text: "Use foo instead" }`.
 *
 * @internal
 */
export interface DocTag {
    readonly name: string;
    readonly text: string;
}

/**
 * @internal
 */
export interface DocComment {
    /** Free text before the first block tag, `null` if empty. */
    readonly description: string | null;
    readonly tags: DocTag[];
}

/**
 * Strips the comment delimiters and the leading `*` gutter from a JSDoc
 * (`/** ... *\/`) or HTML (`<!-- ... -->`) comment body and returns the
 * remaining lines with common indentation removed.
 */
function stripCommentDelimiters(commentText: string): string[] {
    const isBlockComment = commentText.startsWith("/*");
    const body = commentText
        .replace(/^\/\*\*?/, "")
        .replace(/\*\/$/, "")
        .replace(/^<!--/, "")
        .replace(/-->$/, "");
    const lines = body.split(/\r?\n/).map((line) => {
        const withoutGutter = isBlockComment
            ? line.replace(/^\s*\* ?/, "")
            : line;
        return withoutGutter.trimEnd();
    });
    const indentedLines = lines.filter((line) => line.trim() !== "");
    const commonIndent = Math.min(
        ...indentedLines.map((line) => /^\s*/.exec(line)?.[0].length ?? 0),
    );
    return lines.map((line) => line.slice(commonIndent));
}

/**
 * Parse a JSDoc or HTML doc comment into its description and block tags.
 *
 * Only the subset needed for component documentation is supported: a free
 * text description followed by `@tag text` block tags where the tag text may
 * span multiple lines.
 *
 * @internal
 */
export function parseDocComment(commentText: string): DocComment {
    const lines = stripCommentDelimiters(commentText);
    const descriptionLines: string[] = [];
    const tags: Array<{ name: string; lines: string[] }> = [];

    for (const line of lines) {
        const tagMatch = /^\s*@(?<tagName>[-\w]+)(?:\s(?<tagText>.*))?$/.exec(
            line,
        );
        if (tagMatch?.groups) {
            const { tagName, tagText = "" } = tagMatch.groups;
            tags.push({ name: tagName, lines: [tagText] });
            continue;
        }
        const currentTag = tags.at(-1);
        if (currentTag) {
            currentTag.lines.push(line.trim());
            continue;
        }
        descriptionLines.push(line);
    }

    const description = descriptionLines.join("\n").trim();
    return {
        description: description === "" ? null : description,
        tags: tags.map((tag) => ({
            name: tag.name,
            text: tag.lines.join("\n").trim(),
        })),
    };
}

/**
 * A tag on the form `{type} name - description` as used by `@param`,
 * `@property` and `@binding`. The type and the `-` separator are optional.
 *
 * @internal
 */
export interface NamedTag {
    readonly name: string;
    readonly type: string | null;
    readonly description: string | null;
}

/**
 * Parse the text of a `@param`, `@property` or `@binding` tag.
 *
 * Parsed by hand instead of a single regular expression to avoid
 * super-linear backtracking on long descriptions.
 *
 * @internal
 */
export function parseNamedTag(tagText: string): NamedTag | null {
    let remainingText = tagText.trim();
    let type: string | null = null;
    if (remainingText.startsWith("{")) {
        const typeEnd = remainingText.indexOf("}");
        if (typeEnd === -1) {
            return null;
        }
        type = remainingText.slice(1, typeEnd).trim();
        remainingText = remainingText.slice(typeEnd + 1).trim();
    }
    const nameEnd = remainingText.search(/\s/);
    const name =
        nameEnd === -1 ? remainingText : remainingText.slice(0, nameEnd);
    if (name === "" || name === "-") {
        return null;
    }
    const description = (nameEnd === -1 ? "" : remainingText.slice(nameEnd))
        .trim()
        .replace(/^-\s*/, "")
        .trim();
    return {
        name,
        type,
        description: description === "" ? null : description,
    };
}

/**
 * Returns `null` for empty strings (as `vue-component-meta` uses `""` for
 * missing descriptions).
 *
 * @internal
 */
export function emptyToNull(text: string | undefined): string | null {
    if (text === undefined || text === "") {
        return null;
    }
    return text;
}

/**
 * Returns the text of the `@deprecated` tag, `""` if the tag has no text and
 * `null` if the tag is absent.
 *
 * @internal
 */
export function getDeprecatedText(
    tags: ReadonlyArray<{ name: string; text?: string }>,
): string | null {
    const deprecatedTag = tags.find((tag) => tag.name === "deprecated");
    if (!deprecatedTag) {
        return null;
    }
    return deprecatedTag.text ?? "";
}

/**
 * @internal
 */
export function hasIgnoreTag(
    tags: ReadonlyArray<{ name: string; text?: string }>,
): boolean {
    return tags.some((tag) => tag.name === "ignore");
}
