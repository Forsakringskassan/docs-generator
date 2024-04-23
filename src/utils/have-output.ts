import { type FileInfo } from "../document";

/**
 * @internal
 */
export function haveOutput<T extends { fileInfo: FileInfo }>(
    doc: T,
): doc is T & { fileInfo: { outputName: string } } {
    const { fileInfo } = doc;
    return Boolean(fileInfo.outputName);
}
