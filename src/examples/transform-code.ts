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

/* transformations to apply based on language, transforms are run from left to right */
const transformations: Record<string, Array<(code: string) => string>> = {
    javascript: [stripEslintComments],
    typescript: [stripEslintComments],
};

export function transformCode(code: string, lang: string): string {
    const fns = transformations[lang] ?? [];
    for (const fn of fns) {
        code = fn(code);
    }
    return code;
}
