import path from "node:path";

function isExternalUrl(url: string): boolean {
    return (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("//")
    );
}

function isAbsoluteUrl(url: string): boolean {
    return url.startsWith("/");
}

/**
 * @internal
 */
export function relative(
    url: string,
    { fileInfo }: { fileInfo: { path: string } },
): string {
    if (isExternalUrl(url)) {
        return url;
    }
    if (isAbsoluteUrl(url)) {
        /* `/foo` to `./foo` */
        url = `.${url}`;
    }
    const outputPath = fileInfo.path;
    if (outputPath === url || `${outputPath}/` === url) {
        return "./";
    }
    const relative = path.relative(outputPath, url).replace(/\\/g, "/");

    /* force ./ in front of url unless a path already has ./ ../ or similar */
    const prefix = relative.startsWith(".") ? "" : "./";

    /* retain trailing / if present in original url */
    const suffix = url.endsWith("/") ? "/" : "";

    return [prefix, relative, suffix].join("");
}
