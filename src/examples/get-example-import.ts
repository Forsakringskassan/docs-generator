import { globSync } from "glob";
import { normalizePath } from "../utils";

/**
 * Search filename in directories (deep).
 *
 * @internal
 * @deprecated use `fileMatcher()` instead, this function is insanely slow
 */
export function getExampleImport(
    searchDirs: string[],
    filename: string,
): string {
    const pattern = searchDirs.map((dir) => `${dir}/**/${filename}`);
    const matches = globSync(pattern);
    if (matches.length === 0) {
        const message = `No files matched import "${filename}"`;
        throw new Error(message);
    } else if (matches.length > 1) {
        const message = `Multiple files matched import "${filename}"`;
        throw new Error(message);
    } else {
        return normalizePath(matches[0]);
    }
}
