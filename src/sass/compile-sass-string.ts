import fs from "node:fs/promises";
import path from "node:path";
import { compileStringAsync } from "sass";
import { tildeImporter } from "./tilde-importer";

/**
 * @public
 * @param dst - Destination filename.
 * @param style - Inline SCSS string.
 */
export async function compileSassString(
    dst: string,
    style: string,
): Promise<void> {
    const result = await compileStringAsync(style, {
        style: "expanded",
        importers: [tildeImporter],
    });
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, result.css, "utf-8");
}
