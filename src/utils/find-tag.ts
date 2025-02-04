/**
 * From a list of parsed tags in an infoline find a specific tag.
 *
 * @internal
 */
export function findTag(
    tags: string[],
    tag: string,
): { tag: string; value: string | null } | null {
    const match = tags.find((it) => it === tag || it.startsWith(`${tag}=`));
    if (!match) {
        return null;
    }
    if (match === tag) {
        return { tag, value: null };
    } else {
        return { tag, value: match.slice(tag.length + 1) };
    }
}
