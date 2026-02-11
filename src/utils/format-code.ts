import { createSyncFn } from "synckit";
import { type formatCode as FormatCodeFn } from "./format-code.worker";
import workerUrl from "./format-code.worker?worker&url";

/**
 * Format code with prettier.
 *
 * @internal
 * @param source - Sourcecode to format.
 * @param filepath - Filename used when resolving prettier configuration (file
 * does not have to exist)
 * @returns Formatted sourcecode.
 */
export const formatCode = createSyncFn<typeof FormatCodeFn>(workerUrl);
