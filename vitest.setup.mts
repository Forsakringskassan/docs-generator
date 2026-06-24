import path from "node:path";
import { vi } from "vitest";

/* this file is precompiled from vi.global.mts */
vi.mock(import("./src/utils/format-code.worker?worker&url"), () => {
    return {
        default: import.meta.resolve("./temp/workers/format-code.worker.mjs"),
    };
});

/* source references the path from the `dist/` folder, rewrite this to match the
 * structure when tests run */
vi.mock(import("./src/render/template-directory"), () => {
    return {
        templateDirectory: path.join(import.meta.dirname, "templates"),
    };
});
