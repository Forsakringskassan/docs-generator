/**
 * @public
 */
export interface Manifest {
    pages: Array<{
        path: string;
        title: string;
        redirect: null | string;
        outline: Array<{ heading: string; anchor: string }>;
        examples: Array<{ selector: string; language: string; tags: string[] }>;
    }>;
}
