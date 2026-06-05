/**
 * @public
 */
export interface Manifest {
    pages: Array<{
        path: string;
        /** Path to the source document (relative to the project root) */
        src: string;
        title: string;
        redirect: null | string;
        outline: Array<{ heading: string; anchor: string }>;
        examples: Array<{
            name?: string;
            /** Path to imported example file (relative to project root) or `null` if example is inline */
            src: string | null;
            selector: string;
            language: string;
            tags: string[];
        }>;
    }>;
}
