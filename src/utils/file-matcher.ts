import { globSync } from "glob";
import { minimatch } from "minimatch";
import { memoize } from "./memoize";

/**
 * Create a matcher which returns the full path given a filename, partial path
 * to a filename or minimatch pattern.
 *
 * Throws an error if zero or more than one paths match.
 *
 * @internal
 * @param patterns - Minimatch patterns to match all possible files.
 */
export function fileMatcher(
    patterns: string[],
): (filename: string, context?: string) => string {
    const fileList = globSync(patterns, {
        posix: true,
        ignore: "**/node_modules/**",
    });

    return memoize((filename: string, context?: string) => {
        const matches = minimatch.match(fileList, `**/${filename}`);
        if (matches.length === 0) {
            const additionalInfo = context ? ` (${context})` : "";
            const message = `No files matched pattern "${filename}"${additionalInfo}`;
            throw new Error(message);
        } else if (matches.length > 1) {
            const additionalInfo = context ? ` (${context})` : "";
            const message = `Multiple files matched pattern "${filename}"${additionalInfo}. Searched in [${patterns.join(", ")}]`;
            throw new Error(message);
        } else {
            return matches[0];
        }
    });
}
