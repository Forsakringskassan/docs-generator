import { describe, expect, it, vi } from "vitest";
import { type PartialFile } from "../file-reader";
import { createMockDocument, createMockPartial } from "../utils";
import {
    findApiContainer,
    generateIndex,
    onApiContainer,
} from "./extract-markdown-processor";

/* mock `getFingerprint()` for stable tests */
vi.mock(import("../utils/get-fingerprint"), () => {
    return {
        getFingerprint() {
            return "0d15ea5e";
        },
    };
});

describe("findApiContainer()", () => {
    it("should find api containers in markdown", () => {
        expect.assertions(2);
        const markdown = [
            "# heading\n",
            "\n",
            ":::api\n",
            "foo\n",
            ":::\n",
            "\n",
            "lorem ipsum\n",
        ].join("");
        const fn = vi.fn();
        findApiContainer(markdown, fn);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith({
            match: [":::api\n", "foo\n", ":::\n"].join(""),
            tags: [],
            content: "foo",
        });
    });

    it("should handle tags", () => {
        expect.assertions(2);
        const markdown = [
            ":::api  foo   bar=2\tbaz  \n",
            "foo\n",
            ":::\n",
        ].join("");
        const fn = vi.fn();
        findApiContainer(markdown, fn);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith({
            match: expect.any(String),
            tags: ["foo", "bar=2", "baz"],
            content: "foo",
        });
    });

    it("should handle whitespace after marker", () => {
        expect.assertions(2);
        const markdown = ["::: api\n", "foo\n", ":::\n"].join("");
        const fn = vi.fn();
        findApiContainer(markdown, fn);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith({
            match: expect.any(String),
            tags: [],
            content: "foo",
        });
    });

    it("should not match marker on separate line", () => {
        expect.assertions(2);
        const markdown = [":::\n", "api\n", "mock:foo\n", ":::\n"].join("");
        const fn = vi.fn();
        const result = findApiContainer(markdown, fn);
        expect(fn).not.toHaveBeenCalled();
        expect(result).toBe(markdown);
    });

    it("should not match suffixed marker", () => {
        expect.assertions(2);
        const markdown = [":::apiv2\n", "mock:foo\n", ":::\n"].join("");
        const fn = vi.fn();
        const result = findApiContainer(markdown, fn);
        expect(fn).not.toHaveBeenCalled();
        expect(result).toBe(markdown);
    });

    it("should handle whitespace around content", () => {
        expect.assertions(2);
        const markdown = ["::: api\n", "\n", "  foo\n", "\n", ":::\n"].join("");
        const fn = vi.fn();
        findApiContainer(markdown, fn);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith({
            match: expect.any(String),
            tags: [],
            content: "foo",
        });
    });
});

describe("generateIndex()", () => {
    it("should include generator version", () => {
        expect.assertions(1);
        const lines = generateIndex({
            generatorVersion: "1.2.3",
            version: null,
        });
        expect(lines).toContain(`export const generatorVersion = "1.2.3";`);
    });

    it("should include version as string", () => {
        expect.assertions(1);
        const lines = generateIndex({
            generatorVersion: "1.2.3",
            version: "4.5.6",
        });
        expect(lines).toContain(`export const version = "4.5.6";`);
    });

    it("should include version as null", () => {
        expect.assertions(1);
        const lines = generateIndex({
            generatorVersion: "1.2.3",
            version: null,
        });
        expect(lines).toContain(`export const version = null;`);
    });

    it("should escape version", () => {
        expect.assertions(1);
        const lines = generateIndex({
            generatorVersion: "1.2.3",
            version: `"; throw new Error("`,
        });
        expect(lines).toContain(
            `export const version = "\\"; throw new Error(\\"";`,
        );
    });

    it("should serialize metadata", () => {
        expect.assertions(1);
        const metadata = {
            revision: `"; throw new Error("`,
            nested: { tags: ["foo", "bar"], published: true },
        };
        const lines = generateIndex({
            generatorVersion: "1.2.3",
            version: null,
            metadata,
        });
        expect(lines).toContain(
            `export const metadata = ${JSON.stringify(metadata)};`,
        );
    });

    it("should include metadata as null by default", () => {
        expect.assertions(1);
        const lines = generateIndex({
            generatorVersion: "1.2.3",
            version: null,
        });
        expect(lines).toContain(`export const metadata = null;`);
    });
});

describe("onApiContainer()", () => {
    it("should replace container with placeholder", () => {
        expect.assertions(1);
        const docs = [createMockPartial("foo", "foo.md")];
        const result = onApiContainer(docs, new Map(), {
            match: ":::api\nmock:foo\n:::",
            tags: [],
            content: "mock:foo",
        });
        expect(result).toBe(":::api\npartial:html:0d15ea5e\n:::\n");
    });

    it("should leave container untouched if no document matches", () => {
        expect.assertions(1);
        const result = onApiContainer([], new Map(), {
            match: ":::api\nmock:foo\n:::",
            tags: [],
            content: "mock:foo",
        });
        expect(result).toBe(":::api\nmock:foo\n:::");
    });

    it("should leave container untouched if it references a full document (not partial)", () => {
        expect.assertions(1);
        const docs = [createMockDocument("foo", "foo.md")];
        const result = onApiContainer(docs, new Map(), {
            match: ":::api\nmock:foo\n:::",
            tags: [],
            content: "mock:foo",
        });
        expect(result).toBe(":::api\nmock:foo\n:::");
    });

    it("should include format in placeholder", () => {
        expect.assertions(1);
        const docs = [createMockPartial("foo", "foo.md", { format: "json" })];
        const result = onApiContainer(docs, new Map(), {
            match: ":::api\nmock:foo\n:::",
            tags: [],
            content: "mock:foo",
        });
        expect(result).toBe(":::api\npartial:json:0d15ea5e\n:::\n");
    });

    it("should extract partial content", () => {
        expect.assertions(1);
        const docs = [createMockPartial("foo", "foo.md", { body: "Foo!" })];
        const partials = new Map<string, PartialFile>();
        onApiContainer(docs, partials, {
            match: ":::api\nmock:foo\n:::",
            tags: [],
            content: "mock:foo",
        });
        expect(Array.from(partials)).toEqual([
            [
                "partial:html:0d15ea5e",
                { body: "Foo!", format: "html", id: "partial:html:0d15ea5e" },
            ],
        ]);
    });
});
