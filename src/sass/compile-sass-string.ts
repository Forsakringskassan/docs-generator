import fs from "node:fs/promises";
import path from "node:path";
import { compileStringAsync, NodePackageImporter } from "sass";
import { moduleImporter } from "@forsakringskassan/sass-module-importer";

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
        importers: [new NodePackageImporter(), moduleImporter],
    });
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, result.css, "utf-8");
}
