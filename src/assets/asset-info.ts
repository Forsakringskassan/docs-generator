declare module "../processor-context" {
    export interface TemplateData {
        assets: Record<string, AssetInfo & AssetImportmap>;
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
    /** output format */
    readonly format: "iife" | "cjs" | "esm" | "stylesheet";
    /** size in bytes */
    readonly size: number;
    /** asset type */
    readonly type: "css" | "js";
}

/**
 * @internal
 */
export interface InjectedAssetInfo extends AssetInfo {
    /** asset html attributes (serialized as `key="value"` already) */
    readonly attrs: string;
}

/**
 * @internal
 */
export interface AssetImportmap {
    /** true if asset should be written to importmap */
    readonly importmap: boolean;
}
