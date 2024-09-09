import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type BuildOptions, build as esbuild } from "esbuild";
import { getFingerprint, getIntegrity } from "../utils";
import { AssetInfo } from "./asset-info";

/**
 * @internal
 */
export async function compileScript(
    assetFolder: string,
    name: string,
    src: string | URL,
    options?: BuildOptions,
): Promise<AssetInfo> {
    const iconLib = process.env.DOCS_ICON_LIB ?? "@fkui/icon-lib-default";

    try {
        const entryPoints = [src instanceof URL ? fileURLToPath(src) : src];
        const outfile = path.join("temp", `asset-${name}.js`);
        await esbuild({
            entryPoints,
            outfile,
            bundle: true,
            format: "iife",
            platform: "browser",
            external: ["vue", "@fkui/vue"],
            tsconfig: path.join(__dirname, "../tsconfig-examples.json"),
            define: {
                "process.env.DOCS_ICON_LIB": JSON.stringify(iconLib),
            },
            ...options,
        });
        const content = await fs.readFile(outfile, "utf-8");
        const fingerprint = getFingerprint(content);
        const integrity = getIntegrity(content);
        const filename = `${name}-${fingerprint}.js`;
        const dst = path.join(assetFolder, filename);
        await fs.mkdir(path.dirname(dst), { recursive: true });
        await fs.rename(outfile, dst);
        const stat = await fs.stat(dst);
        return {
            name,
            filename,
            publicPath: `./assets/${filename}`,
            integrity,
            size: stat.size,
            type: "js",
        };
    } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        throw new Error(`Failed to compile script "${name}": ${reason}`);
    }
}
