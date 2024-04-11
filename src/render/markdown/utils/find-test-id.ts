/**
 * Find test-id among a list of example tags.
 *
 * @internal
 */
export function findTestId(tags: string[]): string | null {
    const prefix = "test-id=";
    const tag = tags.find((it) => {
        return it.startsWith(prefix);
    });
    const match = tag?.match(/^test-id=(?:"([^"]+)"|'([^']+)'|([^'"]+))$/);
    if (!match) {
        return null;
    }
    /* the matched value will be in match[1], match[2] or match[3] depending on
     * which of the three that matches */
    return match.slice(1).find(Boolean) ?? null;
}
