import fs from "node:fs/promises";
import path from "node:path";
import { moduleImporter } from "@forsakringskassan/sass-module-importer";
import { NodePackageImporter, compileAsync } from "sass";

/**
 * @public
 * @param dst - Destination filename.
 * @param filePath - Sass path.
 */
export async function compileSassString(
    dst: string,
    filePath: string,
): Promise<void> {
    const result = await compileAsync(filePath, {
        style: "expanded",
        importers: [new NodePackageImporter(), moduleImporter()],
    });
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, result.css, "utf8");
}
