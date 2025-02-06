import { type FileInfo } from "../document";

/**
 * @internal
 */
export interface MarkdownNamedExample {
    name: string;
    tags: string[];
    content: string;
    language: string;
}

/**
 * @internal
 */
export interface MarkdownEnv {
    fileInfo: FileInfo;

    /** Set of all heading IDs present (so far) in the markdown document */
    ids: Set<string>;

    /** Inventory of all named examples in this document */
    namedExamples: Map<string, MarkdownNamedExample>;

    /** The current heading level */
    currentHeading: number;
}
