/**
 * @public
 */
export interface FileInfo {
    /** path relative to configured base */
    path: string;
    /** filename without extension */
    name: string;
    /** path relative to project root */
    fullPath: string;
    /**
     * Output filename or `false` to disable writing result to a file.
     *
     * When passing a filename these optional placeholders can be used:
     *
     * - `[hash]` - replaced with the hash of the content body.
     */
    outputName: string | false;
}
