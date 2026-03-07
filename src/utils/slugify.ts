export function slugify(value: string): string {
    return (
        value
            .toLowerCase()
            .replaceAll("/", "--")
            .replaceAll(/[^a-z]+/g, "-")
            /* eslint-disable-next-line sonarjs/slow-regex -- technical debt */
            .replace(/(^-+|-+$)/, "")
    );
}
