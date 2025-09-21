import fs from "node:fs/promises";
import path from "node:path";
import esbuild, { type BuildOptions } from "esbuild";
import { tsconfigPath as tsconfig } from "../tsconfig-path";
import { getFingerprint, getIntegrity, slugify } from "../utils";
import { type VendorAsset } from "./vendor-asset";
import { type NormalizedVendorDefinition } from "./vendor-definition";

export function getAssetSource(asset: NormalizedVendorDefinition): string {
    const lines = [];
    const pkg = asset.package.replace(/\\/g, "/");

    lines.push(`export * from "${pkg}";`);

    return lines.join("\n");
}

/**
 * @internal
 */
export async function compileVendor(
    assetFolder: string,
    vendor: NormalizedVendorDefinition,
    options?: BuildOptions,
): Promise<VendorAsset> {
    const name = path.isAbsolute(vendor.package)
        ? path.basename(vendor.package)
        : vendor.package;
    const slug = slugify(name);
    const outfile = `temp/vendor-${slug}.out.js`;
    const tmpfile = `temp/vendor-${slug}.in.js`;
    const source = getAssetSource(vendor);
    await fs.writeFile(tmpfile, source, "utf-8");
    await esbuild.build({
        entryPoints: [tmpfile],
        outfile,
        bundle: true,
        format: "esm",
        platform: "browser",
        tsconfig,
        define: {
            "process.env.NODE_ENV": JSON.stringify("development"),
            __VUE_OPTIONS_API__: "true",
            __VUE_PROD_DEVTOOLS__: "true",
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
        },
        alias: vendor.alias ? { [vendor.package]: vendor.alias } : undefined,
        ...options,
    });
    const content = await fs.readFile(outfile, "utf-8");
    const fingerprint = getFingerprint(content);
    const integrity = getIntegrity(content);
    const filename = `vendor-${slug}-${fingerprint}.js`;
    const dst = path.join(assetFolder, filename).replace(/\\/g, "/");
    await fs.rename(outfile, dst);
    const stat = await fs.stat(dst);
    return {
        package: vendor.package,
        filename,
        publicPath: `./assets/${filename}`,
        integrity,
        size: stat.size,
    };
}
