import { createMockDocument } from "./create-mock-document";
import { findDocument } from "./find-document";

it("should find document by id", () => {
    expect.assertions(1);
    const docs = [
        createMockDocument("mock-name", "foo.html", { id: "mock-id" }),
    ];
    const result = findDocument(docs, "mock-id");
    expect(result).toEqual(
        expect.objectContaining({
            id: "mock-id",
        }),
    );
});

it("should find document by name", () => {
    expect.assertions(1);
    const docs = [createMockDocument("mock-name", "foo.html")];
    const result = findDocument(docs, "mock-name");
    expect(result).toEqual(
        expect.objectContaining({
            name: "mock-name",
        }),
    );
});

it("should find document by alias", () => {
    expect.assertions(1);
    const docs = [
        createMockDocument("mock-name", "foo.html", {
            alias: ["foo", "bar", "baz"],
        }),
    ];
    const result = findDocument(docs, "bar");
    expect(result).toEqual(
        expect.objectContaining({
            alias: ["foo", "bar", "baz"],
        }),
    );
});

it("should return null if no document matches", () => {
    expect.assertions(1);
    const docs = [createMockDocument("mock-name", "foo.html")];
    const result = findDocument(docs, "missing");
    expect(result).toBeNull();
});
