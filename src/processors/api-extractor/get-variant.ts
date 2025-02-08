/**
 * Get variant from tags.
 *
 * @internal
 */
export function getVariant(tags: string[]): "code" | "table" | "default" {
    if (tags.includes("code")) {
        return "code";
    } else if (tags.includes("table")) {
        return "table";
    } else {
        return "default";
    }
}
