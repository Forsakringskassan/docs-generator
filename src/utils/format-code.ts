import { createSyncFn } from "synckit";
import { type formatCode as FormatCodeFn } from "../workers/format-worker";
import workerPath from "../workers/format-worker?worker&url";

const absoluteWorkerPath = require.resolve(workerPath);

/**
 * @internal
 */
export const formatCode = createSyncFn<typeof FormatCodeFn>(absoluteWorkerPath);
