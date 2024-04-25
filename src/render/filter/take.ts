/**
 * @internal
 */
export function take<T extends Record<string, unknown>>(
    haystack: T[],
    key: string,
    value: string,
): T[] {
    return haystack.filter((it) => it[key] === value);
}
