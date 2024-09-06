/**
 * @internal
 */
export interface DocumentLike {
    documentElement: {
        dataset: DOMStringMap;
    };
}

/**
 * Creates a relative url from path segments relative to the base directory of
 * the site.
 *
 * No matter if the site is deployed at the root `/` of a domain or in a
 * subdirectories `/foobar` the url will be relative to where it is deployed.
 *
 * Additionally it handles pages in subdirectories.
 *
 * The path segements should always be written relative to the base directory,
 * i.e. even if the current page is in a subdirectory the path segments must be
 * from the base.
 *
 * Given:
 *
 * ```ts
 * getUrl("data.json");
 * ```
 *
 * The return value will be:
 *
 * +---------+-----------------------+---------------+
 * | Base    | Current page          | Result        |
 * +---------+-----------------------+---------------+
 * | /       | /index.html           | ./data.json   |
 * | /       | /foo/bar.html         | ../data.json  |
 * | /latest | /latest/index.html    | ./data.json   |
 * | /latest | /latest/foo/bar.html  | ../data.json  |
 * +---------+-----------------------+---------------+
 *
 *
 * @internal
 * @param document - Document instance.
 * @param paths - Path segements to construct url from.
 * @returns Url relative from current page to given path.
 */
export function getUrl(document: DocumentLike, ...paths: string[]): string {
    const { documentElement } = document;
    const rootUrl = documentElement.dataset.rootUrl ?? ".";
    const result = [rootUrl, ...paths].join("/");

    /* special case: when going from base directory and up we get "./..", this
     * is not expected so we strip out the leading "./" */
    if (result.startsWith("./../")) {
        return result.slice("./".length);
    }

    return result;
}
