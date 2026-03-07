export function slugify(value: string): string {
    return value
        .toLowerCase()
        .replaceAll("/", "--")
        .replaceAll(/[^a-z]+/g, "-")
        .replace(/(^-+|-+$)/, "");
}
