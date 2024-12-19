import { normalizeLanguage } from "./normalize-language";

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
