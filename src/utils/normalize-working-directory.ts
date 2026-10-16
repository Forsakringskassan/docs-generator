import { fileURLToPath } from "node:url";
import { normalizePath } from "./normalize-path";

function normalizeDirectory(path: string): string {
    const normalized = normalizePath(path, ".");
    return normalized === "/" ? normalized : normalized.replace(/\/$/, "");
}

/**
 * @internal
 */
export function normalizeWorkingDirectory(value: string | URL | null): string {
    if (!value) {
        return normalizeDirectory(process.cwd());
    }
    if (typeof value === "string") {
        return /^file:/i.test(value)
            ? normalizeWorkingDirectory(new URL(value))
            : normalizeDirectory(value);
    }
    return normalizeDirectory(fileURLToPath(new URL(".", value)));
}
