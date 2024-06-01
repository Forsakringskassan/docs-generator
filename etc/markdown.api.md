## API Report File for "@forsakringskassan/docs-generator"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public (undocumented)
export function createMarkdownRenderer(options: MarkdownOptions): MarkdownRenderer;

// @public (undocumented)
interface Document_2 {
    alias: string[];
    // (undocumented)
    attributes: NormalizedDocumentAttributes;
    // (undocumented)
    body: string;
    // (undocumented)
    fileInfo: FileInfo;
    format: "markdown" | "html" | "json";
    id: string;
    name: string;
    outline: DocumentOutline;
    // (undocumented)
    tags: string[];
    // (undocumented)
    template: string;
    visible: boolean;
}
export { Document_2 as Document }

// @public (undocumented)
export type DocumentBadge = "success" | "error" | "info";

// @public
export type DocumentOutline = DocumentOutlineEntry[];

// @public
export interface DocumentOutlineEntry {
    anchor: string;
    rank: number;
    subheadings: DocumentOutline;
    title: string;
}

// @public
export interface ExampleCompiledResult {
    comments: string[];
    language: string;
    markup: string;
    output: string;
    runtime: true;
    source: string;
    tags: string[];
    task: ExampleCompileTask;
}

// @public
export interface ExampleCompileTask {
    outputFile: string;
    parent: string;
    sourcecode: string;
    sourceFile: string;
}

// @public (undocumented)
export type ExampleResult = ExampleCompiledResult | ExampleStaticResult;

// @public
export interface ExampleStaticResult {
    comments: string[];
    language: string;
    markup: string;
    output: null;
    runtime: boolean;
    source: string;
    tags: string[];
}

// @public (undocumented)
export interface FileInfo {
    fullPath: string;
    name: string;
    outputName: string | false;
    path: string;
}

// @public
export interface MarkdownOptions {
    addResource(dst: string, src: string): void;
    readonly docs: Document_2[];
    generateExample(options: {
        source: string;
        language: string;
        filename: string;
        tags: string[];
    }): ExampleResult;
    handleSoftError(error: SoftErrorType): string;
}

// @public
export interface MarkdownRenderer {
    render(doc: Document_2, content: string): string;
}

// @public (undocumented)
export interface NormalizedDocumentAttributes {
    // (undocumented)
    badge?: DocumentBadge;
    // (undocumented)
    component?: string[];
    // (undocumented)
    href?: string;
    // (undocumented)
    layout?: string;
    sortorder: number;
    // (undocumented)
    status?: string;
    // (undocumented)
    title?: string;
}

// @public
export class SoftError<T extends SoftErrorCode> extends Error {
    // @internal
    constructor(code: T, message: string, ...args: SoftErrorDetails[T] extends undefined ? [] : [SoftErrorDetails[T]]);
    // (undocumented)
    readonly code: T;
    // (undocumented)
    readonly details: SoftErrorDetails[T];
}

// @public (undocumented)
export type SoftErrorCode = keyof SoftErrorDetails;

// @public (undocumented)
export interface SoftErrorDetails {
    // (undocumented)
    EINCLUDERECURSION: undefined;
    // (undocumented)
    EINCLUDETARGET: {
        id: string;
    };
    // (undocumented)
    ELINKFORMAT: undefined;
    // (undocumented)
    ELINKTARGET: {
        key: string;
        hash: string;
        title: string;
    };
    // (undocumented)
    ETAGMISSING: undefined;
}

// @public (undocumented)
export type SoftErrorType = {
    [T in SoftErrorCode]: SoftError<T>;
}[SoftErrorCode];

// (No @packageDocumentation comment for this package)

```