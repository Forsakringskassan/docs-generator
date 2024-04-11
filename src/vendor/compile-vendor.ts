import fs from "node:fs/promises";
import path from "node:path";
import esbuild, { type BuildOptions } from "esbuild";
import { getFingerprint, getIntegrity, slugify } from "../utils";
import { type VendorAsset } from "./vendor-asset";
import { type NormalizedVendorDefinition } from "./vendor-definition";

declare global {
    interface Window {
        __modules__?: Record<string, unknown>;
    }
}

function customRequire<T>(name: string): T {
    if (typeof window.__modules__ === "undefined") {
        window.__modules__ = {};
    }

    const mod = window.__modules__[name];

    if (!mod) {
        throw new Error(`Cannot find module "${name}"`);
    }
    return mod as T;
}

export function getAssetSource(
    asset: NormalizedVendorDefinition,
    require: string,
): string {
    const lines = [];
    const pkg = asset.package.replace(/\\/g, "/");

    if (!asset.expose) {
        return `import "${pkg}"`;
    }

    if (asset.expose === "named") {
        lines.push(`import * as lib from "${pkg}";`);
    } else {
        lines.push(`import lib from "${pkg}";`);
    }

    asset.subpaths.map((subpath, index) => {
        if (asset.expose === "named") {
            lines.push(`import * as lib$${index} from "${subpath}";`);
        } else {
            lines.push(`import lib$${index} from "${subpath}";`);
        }
    });

    lines.push(`window.require = window.require || ${require};`);
    lines.push(`window.__modules__ = window.__modules__ || {};`);
    lines.push(`window.__modules__["${asset.package}"] = lib;`);

    if (typeof asset.alias !== "undefined") {
        lines.push(`window.__modules__["${asset.alias}"] = lib;`);
    }

    asset.subpaths.map((subpath, index) => {
        lines.push(`window.__modules__["${subpath}"] = lib$${index};`);
    });

    if (typeof asset.global !== "undefined") {
        lines.push(`window["${asset.global}"] = lib;`);
    }

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
    const source = getAssetSource(vendor, customRequire.toString());
    const tsconfig = path.resolve(__dirname, "../tsconfig-examples.json");
    await fs.writeFile(tmpfile, source, "utf-8");
    await esbuild.build({
        entryPoints: [tmpfile],
        outfile,
        bundle: true,
        format: "iife",
        platform: "browser",
        tsconfig,
        define: {
            "process.env.NODE_ENV": JSON.stringify(
                process.env.NODE_ENV ?? "production",
            ),
        },
        alias: vendor.alias
            ? { [`${vendor.package}`]: vendor.alias }
            : undefined,
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
