import path from "node:path";
import { type Document } from "../document";
import { findDocument } from "./find-document";

function createDocument(filePath: string, doc: Partial<Document>): Document {
    const parsed = path.parse(filePath);
    return {
        id: filePath,
        name: path.basename(filePath),
        alias: [],
        visible: true,
        attributes: { sortorder: Infinity },
        body: "",
        outline: [],
        format: "markdown",
        tags: [],
        template: "mock",
        fileInfo: {
            path: parsed.dir !== "" ? `./${parsed.dir}` : ".",
            name: parsed.name,
            fullPath: filePath,
            outputName: false,
        },
        ...doc,
    };
}

it("should find document by id", () => {
    expect.assertions(1);
    const docs = [createDocument("foo.html", { id: "mock-id" })];
    const result = findDocument(docs, "mock-id");
    expect(result).toEqual(
        expect.objectContaining({
            id: "mock-id",
        }),
    );
});

it("should find document by name", () => {
    expect.assertions(1);
    const docs = [createDocument("foo.html", { name: "mock-name" })];
    const result = findDocument(docs, "mock-name");
    expect(result).toEqual(
        expect.objectContaining({
            name: "mock-name",
        }),
    );
});

it("should find document by alias", () => {
    expect.assertions(1);
    const docs = [createDocument("foo.html", { alias: ["foo", "bar", "baz"] })];
    const result = findDocument(docs, "bar");
    expect(result).toEqual(
        expect.objectContaining({
            alias: ["foo", "bar", "baz"],
        }),
    );
});

it("should return null if no document matches", () => {
    expect.assertions(1);
    const docs = [createDocument("foo.html", {})];
    const result = findDocument(docs, "missing");
    expect(result).toBeNull();
});
