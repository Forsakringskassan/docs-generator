/**
 * @public
 */
export interface VueFileReaderOptions {
    /**
     * Path to the `tsconfig.json` used to resolve component types.
     *
     * When omitted the nearest `tsconfig.json` is used. If it is a solution
     * style config (only `references`) the referenced project including the
     * component is used, the same way editors resolve the project for a file.
     * If no config includes the component an inferred project with default
     * compiler options is used.
     */
    tsconfig?: string;
}
