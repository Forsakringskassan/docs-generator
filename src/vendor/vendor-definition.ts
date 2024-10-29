/**
 * Describes a vendor assets to be bundled and globally available on the site.
 *
 * @public
 */
export interface VendorDefinitionDescriptor {
    /**
     * Importabe package name or path.
     */
    package: string;

    /**
     * Optional alias for package name or path.
     * When an alias is given the package can be imported using the given alias as well as the original package name.
     * For instance, when using the following configuration "vue" can be imported and resolved as "vue/dist/esm.bundle.js".
     * ```json
     * {
     *   "package": "vue",
     *   "alias": "vue/dist/esm.bundle.js",
     * }
     * ```
     */
    alias?: string;
}

/**
 * @public
 */
export type VendorDefinition = string | VendorDefinitionDescriptor;

/**
 * @internal
 */
export interface NormalizedVendorDefinition {
    package: string;
    alias: string | undefined;
}
