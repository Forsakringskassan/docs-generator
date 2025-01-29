import { getActualMessage } from "./template-render-error";

it("should extract actual error from nunjucks error", () => {
    expect.assertions(1);
    const error = [
        "(/path/to/template.html) [Line 8, Column 3]",
        "  Error: lorem ipsum dolor sit amet",
    ].join("\n");
    const result = getActualMessage(error);
    expect(result).toBe("lorem ipsum dolor sit amet");
});

it("should return original message if it cannot be matched", () => {
    expect.assertions(1);
    const error = ["lorem ipsum dolor sit amet"].join("\n");
    const result = getActualMessage(error);
    expect(result).toBe("lorem ipsum dolor sit amet");
});
