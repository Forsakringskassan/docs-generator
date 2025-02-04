import { hasTag } from "./has-tag";

const tags = ["foo", "bar=spam", "baz"];

it("should return true if tag exists", () => {
    expect.assertions(1);
    const result = hasTag(tags, "foo");
    expect(result).toBeTruthy();
});

it("should return true if tag exists (with value)", () => {
    expect.assertions(1);
    const result = hasTag(tags, "bar");
    expect(result).toBeTruthy();
});

it("should return false if tag does not exist", () => {
    expect.assertions(1);
    const result = hasTag(tags, "missing");
    expect(result).toBeFalsy();
});
