import { memoize } from "../memoize";
import { runCommand } from "../run-command";

/**
 * Get Git commit hash, if present.
 *
 * @internal
 * @param format - If set to `full` it gives the full SHA512 hash, if set to `short` it gives the abbrevated hash.
 */
export const gitCommitHash = memoize((format: "full" | "short" = "short") => {
    if (format === "full") {
        return runCommand(`git rev-parse HEAD`);
    } else {
        return runCommand(`git rev-parse --short HEAD`);
    }
});
