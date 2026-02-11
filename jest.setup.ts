import * as path from "node:path";

/* this file is precompiled from jest.global.js */
jest.mock(
    "./src/utils/format-code.worker?worker&url",
    () => require.resolve("./temp/workers/format-code.worker.mjs"),
    { virtual: true },
);

/* workarounds for jest not supporting `import.meta.*` so we manually mock these
 * exports using commonjs instead */

jest.mock("./src/render/template-directory", () => {
    return {
        __esModule: true,
        templateDirectory: path.join(__dirname, "templates"),
    };
});

jest.mock("./src/tsconfig-path", () => {
    return {
        __esModule: true,
        tsconfigPath: path.join(__dirname, "tsconfig-examples.json"),
    };
});
