import path from "node:path/posix";
import { type Processor } from "../processor";
import { formatSize } from "../utils";
import { compileVendor } from "./compile-vendor";
import { normalizeVendorDefinition } from "./normalize-vendor-definition";
import { type VendorAsset } from "./vendor-asset";
import { type VendorDefinition } from "./vendor-definition";

function getPackageName(vendor: VendorDefinition): string {
    return typeof vendor === "string" ? vendor : vendor.package;
}

function generateVendorAssets(
    assetFolder: string,
    assets: VendorDefinition[],
): Promise<VendorAsset[]> {
    const packages = assets.map(getPackageName);
    const normalized = assets.map(normalizeVendorDefinition);
    const promises = normalized.map((it) => {
        const external = packages.filter((pkg) => pkg !== it.package);
        return compileVendor(assetFolder, it, {
            external,
        });
    });
    return Promise.all(promises);
}

export function vendorProcessor(
    assetFolder: string,
    vendor: VendorDefinition[],
): Processor {
    return {
        stage: "assets",
        name: "vendor-processor",
        async handler(context) {
            const assets = await generateVendorAssets(assetFolder, vendor);
            context.addVendorAsset(assets);
            for (const asset of assets) {
                const filename = path.basename(asset.publicPath);
                context.log(filename, formatSize(asset.size));
            }
        },
    };
}
