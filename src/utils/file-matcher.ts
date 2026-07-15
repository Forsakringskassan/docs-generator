import path from "node:path";
import { globSync } from "glob";
import { memoize } from "./memoize";

/**
 * A function to search for a filename.
 *
 * The filename can optionally include subdirectories or glob patterns:
 *
 * - `foo.ts` searches for `foo.ts` anywhere.
 * - `bar/foo.ts` searches for `foo` in any `bar` directory.
 * - `bar/**\/foo.ts` searches `foo` anywhere in an `bar` directory.
 *
 * @public
 * @since %version%
 * @param filename - The filename to search for
 * @param context - An optional context for usage in error messages
 * @throws Throws an error if the filename could not be found
 * @returns Filename relative to project root
 */
export type FileMatcher = (filename: string, context?: string) => string;

/**
 * Create a matcher which returns the full path given a filename, partial path
 * to a filename or glob pattern.
 *
 * Throws an error if zero or more than one paths match.
 *
 * @internal
 * @param patterns - Glob patterns to match all possible files.
 */
export function fileMatcher(patterns: string[]): FileMatcher {
    const fileList = globSync(patterns, {
        posix: true,
        ignore: "**/node_modules/**",
    });

    return memoize((filename: string, context?: string) => {
        const matches = fileList.filter((file) => {
            /* if the path starts with `../` we strip it out before matching or
             * `path.matchesGlob()` wont match */
            const stem = file.replace(/^(?:\.\.\/)+/, "");
            return path.matchesGlob(stem, `**/${filename}`);
        });
        if (matches.length === 0) {
            const additionalInfo = context ? ` (${context})` : "";
            const message = `No files matched pattern "${filename}"${additionalInfo}`;
            throw new Error(message);
        }
        if (matches.length > 1) {
            const additionalInfo = context ? ` (${context})` : "";
            const message = `Multiple files matched pattern "${filename}"${additionalInfo}. Searched in [${patterns.join(", ")}]`;
            throw new Error(message);
        }
        return matches[0];
    });
}
