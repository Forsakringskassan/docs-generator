import { type Document } from "../document";
import { type FileReader } from "./file-reader";

/**
 * @public
 */
export interface SourceFiles {
    include: string | string[];
    exclude?: string | string[];
    basePath?: string;
    fileReader: FileReader;

    /**
     * Only documents for which filter returns true are used.
     *
     * Runs before `transform`.
     */
    filter?(this: void, doc: Document): boolean;

    /**
     * Transform document before further processing.
     *
     * Typical use-case is modifying attributes, name or aliases.
     */
    transform?(this: void, doc: Document): Document;
}
