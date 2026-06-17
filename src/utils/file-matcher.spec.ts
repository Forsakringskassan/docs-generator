import * as glob from "glob";
import { fileMatcher } from "./file-matcher";

const globSync = jest.spyOn(glob, "globSync");

beforeEach(() => {
    jest.clearAllMocks();
});

it("should return the matched file path", () => {
    expect.assertions(1);
    globSync.mockReturnValue(["src/foo/bar.ts"]);
    const match = fileMatcher(["src/**"]);
    expect(match("bar.ts")).toBe("src/foo/bar.ts");
});

it("should match by partial path", () => {
    expect.assertions(1);
    globSync.mockReturnValue(["src/foo/bar.ts"]);
    const match = fileMatcher(["src/**"]);
    expect(match("foo/bar.ts")).toBe("src/foo/bar.ts");
});

it("should match with glob", () => {
    expect.assertions(1);
    globSync.mockReturnValue(["src/foo/bar.ts"]);
    const match = fileMatcher(["src/**"]);
    expect(match("**/bar.ts")).toBe("src/foo/bar.ts");
});

it("should match in parent directory", () => {
    expect.assertions(1);
    globSync.mockReturnValue(["../../src/foo/bar.ts"]);
    const match = fileMatcher(["../../src/**"]);
    expect(match("bar.ts")).toBe("../../src/foo/bar.ts");
});

it("should throw when no files match", () => {
    expect.assertions(1);
    globSync.mockReturnValue([]);
    const match = fileMatcher(["src/**"]);
    expect(() => match("missing.ts")).toThrowErrorMatchingInlineSnapshot(
        `"No files matched pattern "missing.ts""`,
    );
});

it("should include context in error when no files match", () => {
    expect.assertions(1);
    globSync.mockReturnValue([]);
    const match = fileMatcher(["src/**"]);
    expect(() =>
        match("missing.ts", "some context"),
    ).toThrowErrorMatchingInlineSnapshot(
        `"No files matched pattern "missing.ts" (some context)"`,
    );
});

it("should throw when multiple files match", () => {
    expect.assertions(1);
    globSync.mockReturnValue(["src/foo/bar.ts", "src/baz/bar.ts"]);
    const match = fileMatcher(["src/**"]);
    expect(() => match("bar.ts")).toThrowErrorMatchingInlineSnapshot(
        `"Multiple files matched pattern "bar.ts". Searched in [src/**]"`,
    );
});

it("should include context in error when multiple files match", () => {
    expect.assertions(1);
    globSync.mockReturnValue(["src/foo/bar.ts", "src/baz/bar.ts"]);
    const match = fileMatcher(["src/foo/**", "src/baz/**"]);
    expect(() =>
        match("bar.ts", "some context"),
    ).toThrowErrorMatchingInlineSnapshot(
        `"Multiple files matched pattern "bar.ts" (some context). Searched in [src/foo/**, src/baz/**]"`,
    );
});

it("should call globSync with given patterns", () => {
    expect.assertions(1);
    globSync.mockReturnValue([]);
    fileMatcher(["src/**", "lib/**"]);
    expect(globSync).toHaveBeenCalledWith(["src/**", "lib/**"], {
        posix: true,
        ignore: "**/node_modules/**",
    });
});

it("should only call globSync once per fileMatcher invocation", () => {
    expect.assertions(1);
    globSync.mockReturnValue(["src/foo/bar.ts"]);
    const match = fileMatcher(["src/**"]);
    match("bar.ts");
    match("bar.ts");
    expect(globSync).toHaveBeenCalledTimes(1);
});
