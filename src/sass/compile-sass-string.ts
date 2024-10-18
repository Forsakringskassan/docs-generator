import fs from "node:fs/promises";
import path from "node:path";
import { compileStringAsync, NodePackageImporter } from "sass";
import { moduleImporter } from "./module-importer";

/**
 * @public
 * @param dst - Destination filename.
 * @param style - Inline SCSS string.
 */
export async function compileSassString(
    dst: string,
    style: string,
    options: { cwd?: string } = {},
): Promise<void> {
    const { cwd = process.cwd() } = options;
    const result = await compileStringAsync(style, {
        style: "expanded",
        importers: [new NodePackageImporter(), moduleImporter({ cwd })],
    });
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, result.css, "utf-8");
}
