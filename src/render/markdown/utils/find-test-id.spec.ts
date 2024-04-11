import { findTestId } from "./find-test-id";

it("should find test-id", () => {
    expect.assertions(1);
    const result = findTestId(["nopreview", 'test-id="foo"']);
    expect(result).toBe("foo");
});

it("should return null if test-id is missing", () => {
    expect.assertions(1);
    const result = findTestId(["nopreview"]);
    expect(result).toBeNull();
});

it("should return null if test-id is empty", () => {
    expect.assertions(1);
    const result = findTestId([
        "nopreview",
        "test-id",
        "test-id=",
        "test-id=''",
        'test-id=""',
    ]);
    expect(result).toBeNull();
});

it("should handle unqouted", () => {
    expect.assertions(1);
    const result = findTestId(["test-id=foo"]);
    expect(result).toBe("foo");
});

it("should handle single quotes", () => {
    expect.assertions(1);
    const result = findTestId(["test-id='foo'"]);
    expect(result).toBe("foo");
});

it("should handle double quotes", () => {
    expect.assertions(1);
    const result = findTestId(['test-id="foo"']);
    expect(result).toBe("foo");
});
