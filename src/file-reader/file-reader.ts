import { type Document } from "../document";

/**
 * Read and parse a file from disk to a doc-generator document.
 *
 * @public
 */
export type FileReader = (
    filePath: string,
    basePath?: string,
) => Promise<Document[]>;
