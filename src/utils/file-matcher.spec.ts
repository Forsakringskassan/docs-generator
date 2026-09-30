import { globSync } from "glob";
import { beforeEach, expect, it, vi } from "vitest";
import { fileMatcher } from "./file-matcher";

vi.mock(import("glob"));

beforeEach(() => {
    vi.clearAllMocks();
});

it("should return the matched file path", async () => {
    expect.assertions(1);
    vi.mocked(globSync).mockReturnValue(["src/foo/bar.ts"]);
    const match = await fileMatcher(["src/**"], { ignore: [] });
    expect(match("bar.ts")).toBe("src/foo/bar.ts");
});

it("should match by partial path", async () => {
    expect.assertions(1);
    vi.mocked(globSync).mockReturnValue(["src/foo/bar.ts"]);
    const match = await fileMatcher(["src/**"], { ignore: [] });
    expect(match("foo/bar.ts")).toBe("src/foo/bar.ts");
});

it("should match with glob", async () => {
    expect.assertions(1);
    vi.mocked(globSync).mockReturnValue(["src/foo/bar.ts"]);
    const match = await fileMatcher(["src/**"], { ignore: [] });
    expect(match("**/bar.ts")).toBe("src/foo/bar.ts");
});

it("should match in parent directory", async () => {
    expect.assertions(1);
    vi.mocked(globSync).mockReturnValue(["../../src/foo/bar.ts"]);
    const match = await fileMatcher(["../../src/**"], { ignore: [] });
    expect(match("bar.ts")).toBe("../../src/foo/bar.ts");
});

it("should throw when no files match", async () => {
    expect.assertions(1);
    vi.mocked(globSync).mockReturnValue([]);
    const match = await fileMatcher(["src/**"], { ignore: [] });
    expect(() => match("missing.ts")).toThrowErrorMatchingInlineSnapshot(
        `[Error: No files matched pattern "missing.ts"]`,
    );
});

it("should include context in error when no files match", async () => {
    expect.assertions(1);
    vi.mocked(globSync).mockReturnValue([]);
    const match = await fileMatcher(["src/**"], { ignore: [] });
    expect(() =>
        match("missing.ts", "some context"),
    ).toThrowErrorMatchingInlineSnapshot(
        `[Error: No files matched pattern "missing.ts" (some context)]`,
    );
});

it("should throw when multiple files match", async () => {
    expect.assertions(1);
    vi.mocked(globSync).mockReturnValue(["src/foo/bar.ts", "src/baz/bar.ts"]);
    const match = await fileMatcher(["src/**"], { ignore: [] });
    expect(() => match("bar.ts")).toThrowErrorMatchingInlineSnapshot(
        `[Error: Multiple files matched pattern "bar.ts". Searched in [src/**]]`,
    );
});

it("should include context in error when multiple files match", async () => {
    expect.assertions(1);
    vi.mocked(globSync).mockReturnValue(["src/foo/bar.ts", "src/baz/bar.ts"]);
    const match = await fileMatcher(["src/foo/**", "src/baz/**"], { ignore: [] });
    expect(() =>
        match("bar.ts", "some context"),
    ).toThrowErrorMatchingInlineSnapshot(
        `[Error: Multiple files matched pattern "bar.ts" (some context). Searched in [src/foo/**, src/baz/**]]`,
    );
});

it("should call globSync with given patterns", async () => {
    expect.assertions(1);
    vi.mocked(globSync).mockReturnValue([]);
    await fileMatcher(["src/**", "lib/**"], { ignore: ["**/*.spec.ts"] });
    expect(globSync).toHaveBeenCalledWith(["src/**", "lib/**"], {
        posix: true,
        ignore: ["**/*.spec.ts"],
    });
});

it("should only call globSync once per fileMatcher invocation", async () => {
    expect.assertions(1);
    vi.mocked(globSync).mockReturnValue(["src/foo/bar.ts"]);
    const match = await fileMatcher(["src/**"], { ignore: [] });
    match("bar.ts");
    match("bar.ts");
    expect(globSync).toHaveBeenCalledTimes(1);
});
