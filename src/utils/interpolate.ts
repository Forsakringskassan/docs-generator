/**
 * @internal
 */
export function interpolate(
    value: string,
    data: Record<string, string>,
): string {
    return value.replace(/{{([^{}]+)}}/g, (match, raw: string) => {
        const key = raw.trim();
        const value = data[key] as string | undefined;
        return value ?? match;
    });
}
