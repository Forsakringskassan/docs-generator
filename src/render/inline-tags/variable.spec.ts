import { describe, expect, it } from "vitest";
import { type DocumentPage } from "../../document";
import { SoftError } from "../soft-error";
import { variableTag } from "./variable";

const mockDoc = {} as DocumentPage;

describe("variableTag", () => {
    it("should resolve string variable", () => {
        expect.assertions(1);
        const tag = variableTag({
            sandboxLink: "https://vuejs.org",
        });
        const result = tag.handler(mockDoc, [], "sandboxLink");
        expect(result).toBe("https://vuejs.org");
    });

    it("should resolve numeric variable", () => {
        expect.assertions(1);
        const tag = variableTag({
            version: 42,
        });
        const result = tag.handler(mockDoc, [], "version");
        expect(result).toBe("42");
    });

    it("should serialize objects and arrays as JSON", () => {
        expect.assertions(1);
        const tag = variableTag({ items: ["a", "b"] });
        const result = tag.handler(mockDoc, [], "items");
        expect(result).toBe('["a","b"]');
    });

    it("should trim whitespace around variable name", () => {
        expect.assertions(1);
        const tag = variableTag({
            foo: "bar",
        });
        const result = tag.handler(mockDoc, [], "  foo  ");
        expect(result).toBe("bar");
    });

    it("should throw EVARIABLEFORMAT when content is empty", () => {
        expect.assertions(1);
        const tag = variableTag({});
        expect(() => tag.handler(mockDoc, [], "")).toThrow(
            new SoftError("EVARIABLEFORMAT", 'Failed to parse variable ""'),
        );
    });

    it("should throw EVARIABLEFORMAT when content contains whitespace", () => {
        expect.assertions(1);
        const tag = variableTag({ foo: "bar" });
        expect(() => tag.handler(mockDoc, [], "foo bar")).toThrow(
            new SoftError(
                "EVARIABLEFORMAT",
                'Failed to parse variable "foo bar"',
            ),
        );
    });

    it("should throw EVARIABLETARGET when variable does not exist", () => {
        expect.assertions(1);
        const tag = variableTag({});
        expect(() => tag.handler(mockDoc, [], "missingVar")).toThrow(
            new SoftError(
                "EVARIABLETARGET",
                'Failed to find template variable "missingVar"',
                { key: "missingVar" },
            ),
        );
    });
});
