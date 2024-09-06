import { type Processor } from "../processor";
import { formatSize, serializeAttrs } from "../utils";
import { type CompileOptions } from "./compile-options";
import { compileScript } from "./compile-script";

/**
 * @internal
 */
export interface JSAsset {
    name: string;
    src: string | string[] | URL | URL[];
    options: CompileOptions;
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
            for (const asset of assets) {
                const info = await compileScript(
                    assetFolder,
                    asset.name,
                    asset.src,
                );
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
