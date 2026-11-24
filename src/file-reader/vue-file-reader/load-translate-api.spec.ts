import type * as Typescript from "typescript";
import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
    vi.doUnmock("typescript");
    vi.resetModules();
});

it("should load the component API extractor once", async () => {
    expect.assertions(2);
    const { loadTranslateAPI } = await import("./load-translate-api");
    const translateApiModule = await loadTranslateAPI();
    expect(translateApiModule.translateAPI).toBeInstanceOf(Function);
    await expect(loadTranslateAPI()).resolves.toBe(translateApiModule);
});

it("should explain when typescript does not provide the compiler API", async () => {
    expect.assertions(1);
    /* TypeScript 7 only exports its version */
    const typescript7 = { default: { version: "7.0.2" } };
    vi.doMock(
        import("typescript"),
        () => typescript7 as unknown as typeof Typescript,
    );
    const { loadTranslateAPI } = await import("./load-translate-api");
    await expect(loadTranslateAPI()).rejects.toThrow(
        `vueFileReader requires the TypeScript compiler API ("typescript" 5.x or 6.x) but the installed "typescript" (version 7.0.2) does not provide it.`,
    );
});

it("should explain when typescript is not installed", async () => {
    expect.assertions(1);
    vi.doMock(import("typescript"), () => {
        throw new Error(`Cannot find package "typescript"`);
    });
    const { loadTranslateAPI } = await import("./load-translate-api");
    await expect(loadTranslateAPI()).rejects.toThrow(
        `vueFileReader requires "typescript" 5.x or 6.x to be installed`,
    );
});
