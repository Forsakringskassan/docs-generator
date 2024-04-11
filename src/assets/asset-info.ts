declare module "../processor-context" {
    export interface TemplateData {
        assets: Record<string, AssetInfo>;
        injectHead: InjectedAssetInfo[];
        injectBody: InjectedAssetInfo[];
    }
}

/**
 * @internal
 */
export interface AssetInfo {
    /** name as given by the user */
    readonly name: string;
    /** generated filename (based of name) */
    readonly filename: string;
    /** public path to this asset */
    readonly publicPath: string;
    /** subresource integrity (SRI) */
    readonly integrity: string;
    /** size in bytes */
    readonly size: number;
    /** asset type */
    readonly type: "css" | "js";
}

export interface InjectedAssetInfo extends AssetInfo {
    /** asset html attributes (serialized as `key="value"` already) */
    readonly attrs: string;
}
