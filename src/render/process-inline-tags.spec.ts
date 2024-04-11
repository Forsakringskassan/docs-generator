import { createMockDocument } from "../utils";
import { InlineTag } from "./inline-tags";
import { processInlineTags } from "./process-inline-tags";
import { type SoftErrorType } from "./soft-error";

const mockTag: InlineTag = {
    name: "mock",
    description: "mock tag which uppercases content",
    handler(_doc, _docs, content) {
        return `[${content.toUpperCase()}]`;
    },
};

const rethrow = (err: SoftErrorType): never => {
    throw err;
};
const doc = createMockDocument("foo", "./components/foo.html");
const tags = [mockTag];

it("should replace inline tag with processed content", () => {
    expect.assertions(1);
    const text = "{@mock foobar}";
    expect(processInlineTags(tags, doc, [], text, rethrow)).toBe("[FOOBAR]");
});

it("should handle empty content", () => {
    expect.assertions(1);
    const text = "{@mock}";
    expect(processInlineTags(tags, doc, [], text, rethrow)).toBe("[]");
});

it("should trim whitespace", () => {
    expect.assertions(1);
    const text = "{@mock\n  foobar\n}";
    expect(processInlineTags(tags, doc, [], text, rethrow)).toBe("[FOOBAR]");
});

it("should throw error if tag isn't registered", () => {
    expect.assertions(1);
    const text = "{@missing}";
    expect(() => processInlineTags(tags, doc, [], text, rethrow)).toThrow(
        'No inline tag registered with the name "missing"',
    );
});
