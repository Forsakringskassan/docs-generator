const replacement: Record<string, string> = {
    "<": `&lt;`,
    ">": `&gt;`,
    "&": `&amp;`,
    '"': `&quot;`,
    "'": `&apos;`,
};

/**
 * Encodes symbols as HTML entities:
 *
 * - `<`
 * - `>`
 * - `&`
 * - `"`
 * - `'`
 */
export function htmlencode(text: string): string {
    return text.replace(/[<>&"']/g, (m) => {
        return replacement[m];
    });
}
