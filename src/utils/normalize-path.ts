import path from "node:path/posix";

/**
 * @internal
 */
export function normalizePath(...pathSegments: string[]): string {
    const filePath = path.join(...pathSegments);
    return path
        .normalize(filePath)
        .replace(/^([A-Z]):\\/, "/")
        .replace(/\\/g, "/");
}
