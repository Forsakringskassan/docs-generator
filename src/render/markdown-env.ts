import { type FileInfo } from "../document";

/**
 * @internal
 */
export interface MarkdownEnv {
    fileInfo: FileInfo;

    /** Set of all heading IDs present (so far) in the markdown document */
    ids: Set<string>;
}
