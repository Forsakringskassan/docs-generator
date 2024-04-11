import path from "node:path";

/**
 * Get name without path and extension.
 *
 * @internal
 */
export function getExampleName(filename: string): string {
    return path.parse(filename).name;
}
