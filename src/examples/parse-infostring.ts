function normalizeLanguage(lang: string): string {
    switch (lang) {
        case "ts":
            return "typescript";
        case "js":
            return "javascript";
        default:
            return lang;
    }
}

/**
 * Parse a markdown infostring from a code fence.
 *
 * @internal
 */
export function parseInfostring(infostring: string): {
    language: string;
    tags: string[];
} {
    const [rawLanguage, ...rawTags] = infostring.trim().split(/\s+/);
    return {
        language: normalizeLanguage(rawLanguage),
        tags: rawTags,
    };
}
