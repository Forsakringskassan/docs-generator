/**
 * @internal
 */
export function interpolate(
    value: string,
    data: Record<string, string>,
): string {
    return value.replace(/{{([^{}]+)}}/g, (match, raw) => {
        const key = raw.trim();
        return data[key] ?? match;
    });
}
