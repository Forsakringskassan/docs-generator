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
     * If set, the package will be available on `window` under the given
     * name. Requires the `export` property to be set to have any effect.
     */
    global?: string;

    /**
     * If set this bundle will be exposed for usage with `require(..)` and if
     * `global` is defined on the `window` object.
     *
     * When set to "named" the named exports will be exposed.
     * When set to "default" the default export will be exposed.
     */
    expose?: "named" | "default";

    /**
     * Optional list of additional subpaths to export from the package.
     *
     * E.g.:
     *
     * ```json
     * {
     *   "package": "moment",
     *   "expose": "default",
     *   "subpaths": [
     *     "moment/locale/sv"
     *   ]
     * }
     * ```
     */
    subpaths?: string[];

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
    global?: string;
    expose: "named" | "default";
    subpaths: string[];
    alias?: string;
}
