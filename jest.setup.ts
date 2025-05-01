import * as path from "node:path";

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
