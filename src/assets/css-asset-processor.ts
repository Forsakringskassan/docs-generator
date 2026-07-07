import { type Processor } from "../processor";
import { formatSize, serializeAttrs } from "../utils";
import { type CompileOptions } from "./compile-options";
import { compileStyle } from "./compile-style";

/**
 * @internal
 */
export interface CSSAsset {
    name: string;
    src: string | URL;
    options: CompileOptions;
}

function byPriority(
    { options: a }: CSSAsset,
    { options: b }: CSSAsset,
): number {
    return b.priority - a.priority;
}

/**
 * @internal
 */
export function cssAssetProcessor(
    assetFolder: string,
    assets: CSSAsset[],
): Processor {
    return {
        name: "css-asset-processor",
        after: "assets",
        async handler(context) {
            const assetInfo = context.getTemplateData("assets", {});
            const head = context.getTemplateData("injectHead", []);
            const body = context.getTemplateData("injectBody", []);
            for (const asset of assets.toSorted(byPriority)) {
                const info = await compileStyle(
                    assetFolder,
                    asset.name,
                    asset.src,
                );
                const attrs = serializeAttrs(asset.options.attributes);
                const inject = { ...info, attrs: Array.from(attrs).join(" ") };
                assetInfo[asset.name] = {
                    ...info,
                    importmap: false,
                };
                switch (asset.options.appendTo) {
                    case "none":
                        /* eslint-disable-next-line unicorn/no-break-in-nested-loop -- technical debt */
                        break;
                    case "head":
                        head.push(inject);
                        /* eslint-disable-next-line unicorn/no-break-in-nested-loop -- technical debt */
                        break;
                    case "body":
                        body.push(inject);
                        /* eslint-disable-next-line unicorn/no-break-in-nested-loop -- technical debt */
                        break;
                }
                context.log(info.filename, formatSize(info.size));
            }
        },
    };
}
