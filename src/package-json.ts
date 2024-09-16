/**
 * Interface representing `package.json`.
 *
 * @public
 */
export interface PackageJson {
    readonly name: string;
    readonly version: string;
    readonly repository?: {
        readonly url?: string;
    };
}
