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
            selector: string;
            language: string;
            tags: string[];
        }>;
    }>;
}
