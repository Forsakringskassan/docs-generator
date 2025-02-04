/**
 * Tell if a specific tag is present in a list of parsed tags in an infoline.
 *
 * @internal
 */
export function hasTag(tags: string[], tag: string): boolean {
    const match = tags.find((it) => it === tag || it.startsWith(`${tag}=`));
    return Boolean(match);
}
