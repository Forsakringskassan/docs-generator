import { findTag } from "./find-tag";

const tags = ["foo", "bar=spam", "baz"];

it("should find tag", () => {
    expect.assertions(2);
    const result = findTag(tags, "foo");
    expect(result).toBeTruthy();
    expect(result).toEqual({ tag: "foo", value: null });
});

it("should find tag with value", () => {
    expect.assertions(2);
    const result = findTag(tags, "bar");
    expect(result).toBeTruthy();
    expect(result).toEqual({ tag: "bar", value: "spam" });
});

it("should return null if tag does not exist", () => {
    expect.assertions(1);
    const result = findTag(tags, "missing");
    expect(result).toBeNull();
});
