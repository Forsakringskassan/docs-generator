import { parseFile } from "./front-matter-file-reader";

describe("fileInfo", () => {
    it("should generate fileInfo for index.md", () => {
        expect.assertions(1);
        const { fileInfo } = parseFile(
            "src/components/foo/index.md",
            "src",
            "",
        );
        expect(fileInfo).toMatchInlineSnapshot(`
            {
              "fullPath": "src/components/foo/index.md",
              "name": "index",
              "outputName": "index.html",
              "path": "./components/foo",
            }
        `);
    });

    it("should generate fileInfo for child.md", () => {
        expect.assertions(1);
        const { fileInfo } = parseFile(
            "src/components/foo/child.md",
            "src",
            "",
        );
        expect(fileInfo).toMatchInlineSnapshot(`
            {
              "fullPath": "src/components/foo/child.md",
              "name": "child",
              "outputName": "child.html",
              "path": "./components/foo",
            }
        `);
    });

    it("should rename file named same as parent directory", () => {
        expect.assertions(1);
        const { fileInfo } = parseFile("src/components/foo/foo.md", "src", "");
        expect(fileInfo).toMatchInlineSnapshot(`
            {
              "fullPath": "src/components/foo/foo.md",
              "name": "index",
              "outputName": "index.html",
              "path": "./components/foo",
            }
        `);
    });

    it("should rename readme", () => {
        expect.assertions(1);
        const { fileInfo } = parseFile(
            "src/components/foo/README.md",
            "src",
            "",
        );
        expect(fileInfo).toMatchInlineSnapshot(`
            {
              "fullPath": "src/components/foo/README.md",
              "name": "index",
              "outputName": "index.html",
              "path": "./components/foo",
            }
        `);
    });

    it("should normalize windows backslashes", () => {
        expect.assertions(1);
        const { fileInfo } = parseFile(
            "src\\components\\foo\\index.md",
            "src",
            "",
        );
        expect(fileInfo).toMatchInlineSnapshot(`
            {
              "fullPath": "src/components/foo/index.md",
              "name": "index",
              "outputName": "index.html",
              "path": "./components/foo",
            }
        `);
    });

    it("should handle empty basePath", () => {
        expect.assertions(1);
        const { fileInfo } = parseFile("components/foo/index.md", "", "");
        expect(fileInfo).toMatchInlineSnapshot(`
            {
              "fullPath": "components/foo/index.md",
              "name": "index",
              "outputName": "index.html",
              "path": "./components/foo",
            }
        `);
    });

    it("should handle files directly under basePath", () => {
        expect.assertions(1);
        const { fileInfo } = parseFile("index.md", "", "");
        expect(fileInfo).toMatchInlineSnapshot(`
            {
              "fullPath": "index.md",
              "name": "index",
              "outputName": "index.html",
              "path": ".",
            }
        `);
    });

    it("should handle single level directory", () => {
        expect.assertions(1);
        const { fileInfo } = parseFile("foo/index.md", "", "");
        expect(fileInfo).toMatchInlineSnapshot(`
            {
              "fullPath": "foo/index.md",
              "name": "index",
              "outputName": "index.html",
              "path": "./foo",
            }
        `);
    });

    it("should handle index.md in root", () => {
        expect.assertions(1);
        const { fileInfo } = parseFile("index.md", "", "");
        expect(fileInfo).toMatchInlineSnapshot(`
            {
              "fullPath": "index.md",
              "name": "index",
              "outputName": "index.html",
              "path": ".",
            }
        `);
    });

    it("should handle readme.md in root", () => {
        expect.assertions(1);
        const { fileInfo } = parseFile("README.md", "", "");
        expect(fileInfo).toMatchInlineSnapshot(`
            {
              "fullPath": "README.md",
              "name": "index",
              "outputName": "index.html",
              "path": ".",
            }
        `);
    });
});
