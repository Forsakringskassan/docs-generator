import { glob } from "node:fs/promises";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock(import("node:fs/promises"));

async function* toAsyncIterator<T>(values: T[]): AsyncGenerator<T> {
    /* eslint-disable-next-line @typescript-eslint/await-thenable -- must force result to be async */
    yield* await values;
}

describe.each(["posix", "win32"] as const)("%s", (variant) => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
        vi.doMock(import("node:path"), async (importActual) => {
            const path = await importActual();
            return { default: path[variant] };
        });
    });

    it("should return the matched file path", async () => {
        expect.assertions(1);
        const { default: path } = await import("node:path");
        const { fileMatcher } = await import("./file-matcher");
        const filePath = path.join("src", "foo", "bar.ts");
        vi.mocked(glob).mockReturnValue(toAsyncIterator([filePath]));
        const match = await fileMatcher(["src/**"], { ignore: [] });
        expect(match("bar.ts")).toBe(filePath);
    });

    it("should match by partial path", async () => {
        expect.assertions(1);
        const { default: path } = await import("node:path");
        const { fileMatcher } = await import("./file-matcher");
        const filePath = path.join("src", "foo", "bar.ts");
        vi.mocked(glob).mockReturnValue(toAsyncIterator([filePath]));
        const match = await fileMatcher(["src/**"], { ignore: [] });
        expect(match("foo/bar.ts")).toBe(filePath);
    });

    it("should match with glob", async () => {
        expect.assertions(1);
        const { default: path } = await import("node:path");
        const { fileMatcher } = await import("./file-matcher");
        const filePath = path.join("src", "foo", "bar.ts");
        vi.mocked(glob).mockReturnValue(toAsyncIterator([filePath]));
        const match = await fileMatcher(["src/**"], { ignore: [] });
        expect(match("**/bar.ts")).toBe(filePath);
    });

    it("should match in parent directory", async () => {
        expect.assertions(1);
        const { default: path } = await import("node:path");
        const { fileMatcher } = await import("./file-matcher");
        const filePath = path.join("..", "..", "src", "foo", "bar.ts");
        vi.mocked(glob).mockReturnValue(toAsyncIterator([filePath]));
        const match = await fileMatcher(["../../src/**"], { ignore: [] });
        expect(match("bar.ts")).toBe(filePath);
    });

    it("should throw when no files match", async () => {
        expect.assertions(1);
        const { fileMatcher } = await import("./file-matcher");
        vi.mocked(glob).mockReturnValue(toAsyncIterator([]));
        const match = await fileMatcher(["src/**"], { ignore: [] });
        expect(() => match("missing.ts")).toThrowErrorMatchingInlineSnapshot(
            `[Error: No files matched pattern "missing.ts"]`,
        );
    });

    it("should include context in error when no files match", async () => {
        expect.assertions(1);
        const { fileMatcher } = await import("./file-matcher");
        vi.mocked(glob).mockReturnValue(toAsyncIterator([]));
        const match = await fileMatcher(["src/**"], { ignore: [] });
        expect(() =>
            match("missing.ts", "some context"),
        ).toThrowErrorMatchingInlineSnapshot(
            `[Error: No files matched pattern "missing.ts" (some context)]`,
        );
    });

    it("should throw when multiple files match", async () => {
        expect.assertions(1);
        const { default: path } = await import("node:path");
        const { fileMatcher } = await import("./file-matcher");
        const filePath1 = path.join("src", "foo", "bar.ts");
        const filePath2 = path.join("src", "baz", "bar.ts");
        vi.mocked(glob).mockReturnValue(
            toAsyncIterator([filePath1, filePath2]),
        );
        const match = await fileMatcher(["src/**"], { ignore: [] });
        expect(() => match("bar.ts")).toThrowErrorMatchingInlineSnapshot(
            `[Error: Multiple files matched pattern "bar.ts". Searched in [src/**]]`,
        );
    });

    it("should include context in error when multiple files match", async () => {
        expect.assertions(1);
        const { default: path } = await import("node:path");
        const { fileMatcher } = await import("./file-matcher");
        const filePath1 = path.join("src", "foo", "bar.ts");
        const filePath2 = path.join("src", "baz", "bar.ts");
        vi.mocked(glob).mockReturnValue(
            toAsyncIterator([filePath1, filePath2]),
        );
        const match = await fileMatcher(["src/foo/**", "src/baz/**"], {
            ignore: [],
        });
        expect(() =>
            match("bar.ts", "some context"),
        ).toThrowErrorMatchingInlineSnapshot(
            `[Error: Multiple files matched pattern "bar.ts" (some context). Searched in [src/foo/**, src/baz/**]]`,
        );
    });

    it("should call glob with given patterns", async () => {
        expect.assertions(1);
        const { fileMatcher } = await import("./file-matcher");
        vi.mocked(glob).mockReturnValue(toAsyncIterator([]));
        await fileMatcher(["src/**", "lib/**"], { ignore: ["**/*.spec.ts"] });
        expect(glob).toHaveBeenCalledWith(["src/**", "lib/**"], {
            exclude: ["**/*.spec.ts"],
        });
    });

    it("should only call glob once per fileMatcher invocation", async () => {
        expect.assertions(1);
        const { default: path } = await import("node:path");
        const { fileMatcher } = await import("./file-matcher");
        const filePath = path.join("src", "foo", "bar.ts");
        vi.mocked(glob).mockReturnValue(toAsyncIterator([filePath]));
        const match = await fileMatcher(["src/**"], { ignore: [] });
        match("bar.ts");
        match("bar.ts");
        expect(glob).toHaveBeenCalledTimes(1);
    });
});
