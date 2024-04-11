import fs from "node:fs/promises";
import path from "node:path/posix";
import { compileSassString } from "../sass";
import { getFingerprint, getIntegrity } from "../utils";
import { AssetInfo } from "./asset-info";

/**
 * @internal
 */
export async function compileStyle(
    assetFolder: string,
    name: string,
    src: string,
): Promise<AssetInfo> {
    try {
        const outfile = path.join("temp", `asset-${name}.css`);
        const source = await fs.readFile(src, "utf-8");
        await compileSassString(outfile, source);
        const content = await fs.readFile(outfile, "utf-8");
        const fingerprint = getFingerprint(content);
        const integrity = getIntegrity(content);
        const filename = `${name}-${fingerprint}.css`;
        const dst = path.join(assetFolder, filename);
        await fs.rename(outfile, dst);
        const stat = await fs.stat(dst);
        return {
            name,
            filename,
            publicPath: `./assets/${filename}`,
            integrity,
            size: stat.size,
            type: "css",
        };
    } catch (err) {
        /* eslint-disable-next-line no-console -- expected to log */
        console.error(err);
        throw new Error(`Failed to compile style "${name}"`);
    }
}
