import { fileURLToPath } from "node:url";
import { normalizePath } from "./normalize-path";

/**
 * @internal
 */
export function normalizeWorkingDirectory(value: string | URL | null): string {
    if (!value) {
        return normalizePath(process.cwd());
    }
    if (typeof value === "string") {
        return /^file:/i.test(value)
            ? normalizeWorkingDirectory(new URL(value))
            : normalizePath(value, ".");
    }
    return normalizePath(fileURLToPath(new URL(".", value)), ".");
}
