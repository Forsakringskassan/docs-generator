/**
 * @internal
 */
export function normalizeLanguage(lang: string): string {
    switch (lang) {
        case "ts":
            return "typescript";
        case "js":
            return "javascript";
        default:
            return lang;
    }
}
