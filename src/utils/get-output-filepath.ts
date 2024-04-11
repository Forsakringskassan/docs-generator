import { normalizePath } from "./normalize-path";

export interface FileInfoLike {
    path: string;
    outputName: string | false;
}

/**
 * Get the final output filename.
 *
 * @internal
 */
export function getOutputFilePath(
    outputFolder: string,
    fileInfo: FileInfoLike & { outputName: string },
): string;
export function getOutputFilePath(
    outputFolder: string,
    fileInfo: FileInfoLike & { outputName: false },
): null;
export function getOutputFilePath(
    outputFolder: string,
    fileInfo: FileInfoLike,
): string | null;
export function getOutputFilePath(
    outputFolder: string,
    fileInfo: FileInfoLike,
): string | null {
    const { path, outputName } = fileInfo;
    if (outputName === false) {
        return null;
    }
    return normalizePath(outputFolder, path, outputName);
}
