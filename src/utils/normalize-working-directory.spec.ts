import { pathToFileURL } from "node:url";
import { expect, it } from "vitest";
import { normalizePath } from "./normalize-path";
import { normalizeWorkingDirectory } from "./normalize-working-directory";

it("should use the current working directory when no directory is provided", () => {
    expect.assertions(1);
    expect(normalizeWorkingDirectory(null)).toBe(normalizePath(process.cwd()));
});

it("should accept import.meta.dirname", () => {
    expect.assertions(1);
    expect(normalizeWorkingDirectory(import.meta.dirname)).toBe(
        normalizePath(import.meta.dirname),
    );
});

it.each([
    ["/path/to/docs", "/path/to/docs"],
    ["/path/to/docs/", "/path/to/docs"],
    ["/", "/"],
    ["/path/to/../docs", "/path/docs"],
    ["./docs", "docs"],
    ["docs with spaces/#examples", "docs with spaces/#examples"],
    ["C:\\path\\to\\docs", "/path/to/docs"],
])("should normalize directory path %s", (value, expected) => {
    expect.assertions(1);
    expect(normalizeWorkingDirectory(value)).toBe(expected);
});

it("should accept import.meta.url", () => {
    expect.assertions(1);
    expect(normalizeWorkingDirectory(import.meta.url)).toBe(
        normalizePath(import.meta.dirname),
    );
});

it("should accept a file URL object", () => {
    expect.assertions(1);
    expect(normalizeWorkingDirectory(new URL(import.meta.url))).toBe(
        normalizePath(import.meta.dirname),
    );
});

it("should accept a case-insensitive file URL scheme", () => {
    expect.assertions(1);
    expect(
        normalizeWorkingDirectory(import.meta.url.replace(/^file:/, "FILE:")),
    ).toBe(normalizePath(import.meta.dirname));
});

it.each(["string", "object"])(
    "should accept a directory URL as a %s",
    (type) => {
        expect.assertions(1);
        const url = new URL("./", import.meta.url);
        expect(
            normalizeWorkingDirectory(type === "string" ? url.href : url),
        ).toBe(normalizePath(import.meta.dirname));
    },
);

it("should decode file URL paths", () => {
    expect.assertions(1);
    const directory = `${import.meta.dirname}/docs with spaces/#examples`;
    const url = pathToFileURL(`${directory}/build.mjs`);
    expect(normalizeWorkingDirectory(url)).toBe(normalizePath(directory));
});

it("should ignore file URL query and fragment", () => {
    expect.assertions(1);
    const url = new URL(import.meta.url);
    url.search = "?query";
    url.hash = "#fragment";
    expect(normalizeWorkingDirectory(url)).toBe(
        normalizePath(import.meta.dirname),
    );
});

it("should reject non-file URL objects", () => {
    expect.assertions(1);
    expect(() =>
        normalizeWorkingDirectory(new URL("https://example.com/build.mjs")),
    ).toThrow("The URL must be of scheme file");
});
