/**
 * Represents a compiled vendor asset.
 *
 * @public
 */
export interface VendorAsset {
    package: string;

    /** Filename of the asset */
    filename: string;

    /** Public path to the asset (including filename) */
    publicPath: string;

    /** Subresource integrity */
    integrity: string;

    /** size of asset in bytes */
    size: number;
}
