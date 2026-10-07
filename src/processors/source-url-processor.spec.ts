import { describe, expect, it } from "vitest";
import { filenamePattern } from "./source-url-processor";

describe("filenamePattern()", () => {
    it("should handle string", () => {
        expect.assertions(1);
        const result = filenamePattern("foo", "txt");
        expect(result).toBe("foo.txt");
    });

    it("should handle array with no elements", () => {
        expect.assertions(1);
        const result = filenamePattern("foo", []);
        expect(result).toBe("foo");
    });

    it("should handle array with single element", () => {
        expect.assertions(1);
        const result = filenamePattern("foo", ["txt"]);
        expect(result).toBe("foo.txt");
    });

    it("should handle array with multiple elements", () => {
        expect.assertions(1);
        const result = filenamePattern("foo", ["txt", "vue"]);
        expect(result).toBe("foo.{txt,vue}");
    });
});
