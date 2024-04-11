import { parseImport } from "./parse-import";

it("should parse filename from import block", () => {
    expect.assertions(1);
    const block = "MyAwesomeComponent.vue";
    const { filename } = parseImport(block);
    expect(filename).toBe("MyAwesomeComponent.vue");
});

it("should handle leading an trailing whitespace", () => {
    expect.assertions(1);
    const block = "\n  MyAwesomeComponent.vue\n\n";
    const { filename } = parseImport(block);
    expect(filename).toBe("MyAwesomeComponent.vue");
});

it("should strip comments from filename", () => {
    expect.assertions(1);
    const block = [
        "<!-- lorem ipsum -->",
        "<!--",
        "multiline",
        "comment",
        "-->",
        "MyAwesomeComponent.vue",
        "<!-- dolor sit amet -->",
    ].join("\n");
    const { filename } = parseImport(block);
    expect(filename).toBe("MyAwesomeComponent.vue");
});

it("should return list of comments", () => {
    expect.assertions(1);
    const block = [
        "<!-- lorem ipsum -->",
        "<!--",
        "multiline",
        "comment",
        "-->",
        "MyAwesomeComponent.vue",
        "<!-- dolor sit amet -->",
    ].join("\n");
    const { comments } = parseImport(block);
    expect(comments).toEqual([
        "<!-- lorem ipsum -->",
        "<!--\nmultiline\ncomment\n-->",
        "<!-- dolor sit amet -->",
    ]);
});

it("should empty list if there are no comments", () => {
    expect.assertions(1);
    const block = "MyAwesomeComponent.vue";
    const { comments } = parseImport(block);
    expect(comments).toEqual([]);
});

it("should parse extension from import block", () => {
    expect.assertions(1);
    const block = "MyAwesomeComponent.vue";
    const { extension } = parseImport(block);
    expect(extension).toBe("vue");
});

it("should handle when extension is missing", () => {
    expect.assertions(1);
    const block = "MyAwesomeComponent";
    const { extension } = parseImport(block);
    expect(extension).toBe("");
});
