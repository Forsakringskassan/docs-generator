import { parseInfostring } from "./parse-infostring";

it("should return language and tags from infostring", () => {
    expect.assertions(2);
    const result = parseInfostring("typescript foo bar");
    expect(result.language).toBe("typescript");
    expect(result.tags).toEqual(["foo", "bar"]);
});

it("should handle missing tags", () => {
    expect.assertions(2);
    const result = parseInfostring("typescript");
    expect(result.language).toBe("typescript");
    expect(result.tags).toEqual([]);
});

it("should handle excessive whitespace", () => {
    expect.assertions(2);
    const result = parseInfostring("typescript    foo\tbar");
    expect(result.language).toBe("typescript");
    expect(result.tags).toEqual(["foo", "bar"]);
});

it("should handle trailing whitespace", () => {
    expect.assertions(2);
    const result = parseInfostring("typescript foo bar ");
    expect(result.language).toBe("typescript");
    expect(result.tags).toEqual(["foo", "bar"]);
});

it("should handle missing language", () => {
    expect.assertions(2);
    const result = parseInfostring("");
    expect(result.language).toBe("");
    expect(result.tags).toEqual([]);
});

it("should normalize language tag", () => {
    expect.assertions(2);
    expect(parseInfostring("ts").language).toBe("typescript");
    expect(parseInfostring("js").language).toBe("javascript");
});
