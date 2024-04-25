/**
 * @internal
 */
export function dump(value: unknown): string {
    return `<pre>${JSON.stringify(value, null, 2)}</pre>`;
}
