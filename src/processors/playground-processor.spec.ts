import { fs, vol } from "memfs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    generateUrl,
    getFiles,
    normalizeEntries,
    normalizeEntry,
} from "./playground-processor";

/* @ts-expect-error -- technical debt: memfs is not 100% type compatible */
vi.mock(import("node:fs/promises"), () => {
    const original = fs.promises.glob;

    /* @ts-expect-error -- workaround for https://github.com/streamich/memfs/issues/1161 */
    fs.promises.glob = async function* (...args) {
        const arr = await original(...args);
        for (const s of arr) {
            yield s;
        }
    };

    return {
        default: fs.promises,
    };
});

beforeEach(() => {
    vol.reset();
    vol.fromJSON({
        "/sandbox/main.ts": "main content",
        "/sandbox/src/foo.ts": "foo content",
        "/sandbox/src/bar.ts": "bar content",
        "/temp/index.ts": "temp",
    });
});

describe("normalizeEntries", () => {
    it("should fill in missing defaults", () => {
        expect.assertions(2);
        const result = normalizeEntries([
            { id: "mock", urlFormat: "https://example.net" },
        ]);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            id: "mock",
            urlFormat: "https://example.net",
            variable: null,
            folder: null,
            serialize: expect.any(Function),
        });
    });

    it("should use given serializer if entry contains one", () => {
        expect.assertions(2);
        const fn = vi.fn();
        const result = normalizeEntries([
            { id: "mock", urlFormat: "https://example.net", serialize: fn },
        ]);
        expect(result).toHaveLength(1);
        expect(result[0].serialize).toBe(fn);
    });

    it("should use default serializer if entry is missing serializer", () => {
        expect.assertions(3);
        const result = normalizeEntries([
            { id: "mock", urlFormat: "https://example.net" },
        ]);
        const files = new Map<string, string>([["main.ts", "lorem ipsum"]]);
        expect(result).toHaveLength(1);
        expect(result[0].serialize).toBeInstanceOf(Function);
        expect(result[0].serialize({ files })).toBe(
            '{"main.ts":"lorem ipsum"}',
        );
    });

    it("should handle missing entries", () => {
        expect.assertions(1);
        const result = normalizeEntries(undefined);
        expect(result).toEqual([]);
    });
});

describe("getFiles()", () => {
    it("should get files", async () => {
        expect.assertions(1);
        const result = await getFiles({ folder: "/sandbox" });
        expect(Object.fromEntries(result)).toEqual({
            "main.ts": "main content",
            "src/foo.ts": "foo content",
            "src/bar.ts": "bar content",
        });
    });
});

describe("generateUrl()", () => {
    it("should generate url with base64 hash", async () => {
        expect.assertions(1);
        const entry = normalizeEntry({
            id: "mock",
            variable: "mock-var",
            folder: "/sandbox",
            urlFormat: "https://example.net/#{{ base64 }}",
        });
        const result = await generateUrl(entry);
        expect(result).toMatchInlineSnapshot(
            `"https://example.net/#eyJtYWluLnRzIjoibWFpbiBjb250ZW50Iiwic3JjL2Jhci50cyI6ImJhciBjb250ZW50Iiwic3JjL2Zvby50cyI6ImZvbyBjb250ZW50In0="`,
        );
    });

    it("should generate url with zlibBase64 hash", async () => {
        expect.assertions(1);
        const entry = normalizeEntry({
            id: "mock",
            variable: "mock-var",
            folder: "/sandbox",
            urlFormat: "https://example.net/#{{ zlibBase64 }}",
        });
        const result = await generateUrl(entry);
        expect(result).toMatchInlineSnapshot(
            `"https://example.net/#eNqrVspNzMzTKylWsgKzFJLz80pS80qUdJSKi5L1kxKLIHJABppUWn4+RArIgEvVAgBJwxtR"`,
        );
    });

    it("should when no folder is specified", async () => {
        expect.assertions(1);
        const entry = normalizeEntry({
            id: "mock",
            variable: "mock-var",
            urlFormat: "{{ base64 }}",
        });
        const result = await generateUrl(entry);
        const decoded = atob(result);
        expect(decoded).toMatchInlineSnapshot(`"{}"`);
    });

    it("should handle unicode characters", async () => {
        expect.assertions(1);
        const snowman = "☃";
        vol.reset();
        vol.fromJSON({
            "/sandbox/main.ts": snowman,
        });
        const entry = normalizeEntry({
            id: "mock",
            variable: "mock-var",
            folder: "/sandbox",
            urlFormat: "{{ base64 }}",
        });
        const result = await generateUrl(entry);
        /* eslint-disable-next-line @typescript-eslint/no-deprecated -- deprecated by the standard way of handling unicode codepoints */
        const decoded = decodeURIComponent(escape(atob(result)));
        const parsed = JSON.parse(decoded);
        expect(parsed["main.ts"]).toBe(snowman);
    });

    it("should handle unknown encodings", async () => {
        expect.assertions(1);
        const entry = normalizeEntry({
            id: "mock",
            variable: "mock-var",
            folder: "/sandbox",
            urlFormat: "https://example.net/#{{ unknown }}",
        });
        const result = await generateUrl(entry);
        expect(result).toMatchInlineSnapshot(
            `"https://example.net/#%7B%7B%20unknown%20%7D%7D"`,
        );
    });
});
