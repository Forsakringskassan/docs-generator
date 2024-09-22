import { type BuildOptions } from "esbuild";
import { type Processor } from "../processor";
import { formatSize, serializeAttrs } from "../utils";
import { type CompileOptions } from "./compile-options";
import { compileScript } from "./compile-script";

/**
 * @internal
 */
export interface JSAsset {
    name: string;
    src: string | URL;
    options: CompileOptions;
    buildOptions: Pick<BuildOptions, "define">;
}

function byPriority({ options: a }: JSAsset, { options: b }: JSAsset): number {
    return b.priority - a.priority;
}

/**
 * Cannot use Array.toSorted(..) until NodeJS 20.
 */
function toSorted<T>(values: T[], comparator: (a: T, b: T) => number): T[] {
    return [...values].sort(comparator);
}

/**
 * @internal
 */
export function jsAssetProcessor(
    assetFolder: string,
    assets: JSAsset[],
): Processor {
    return {
        name: "js-asset-processor",
        after: "assets",
        async handler(context) {
            const assetInfo = context.getTemplateData("assets") ?? {};
            const head = context.getTemplateData("injectHead") ?? [];
            const body = context.getTemplateData("injectBody") ?? [];
            for (const asset of toSorted(assets, byPriority)) {
                const info = await compileScript({
                    assetFolder,
                    name: asset.name,
                    src: asset.src,
                    buildOptions: asset.buildOptions,
                });
                const attrs = serializeAttrs(asset.options.attributes);
                const inject = { ...info, attrs: Array.from(attrs).join(" ") };
                assetInfo[asset.name] = info;
                switch (asset.options.appendTo) {
                    case "none":
                        break;
                    case "head":
                        head.push(inject);
                        break;
                    case "body":
                        body.push(inject);
                        break;
                }
                context.setTemplateData("injectHead", head);
                context.setTemplateData("injectBody", body);
                context.log(info.filename, formatSize(info.size));
            }
        },
    };
}
