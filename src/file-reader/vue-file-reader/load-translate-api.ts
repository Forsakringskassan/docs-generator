/* The component API extractor (`vue-component-meta` and the TypeScript
 * compiler API) is loaded on first use instead of when docs-generator is
 * imported, so projects not documenting Vue components neither pay the
 * startup cost nor need a compatible `typescript` installed. */

/* type only, the module itself is imported dynamically */
import type * as TranslateApi from "./translate-api";

type TranslateApiModule = typeof TranslateApi;

const supportedTypeScript = `"typescript" 5.x or 6.x`;

let translateApiModule: Promise<TranslateApiModule> | undefined;

/**
 * TypeScript 7 (the native compiler) is published as `typescript` but does
 * not provide the compiler API `vue-component-meta` is built on.
 */
async function assertTypeScriptCompilerApi(): Promise<void> {
    let typescriptModule: unknown;
    try {
        typescriptModule = await import("typescript");
    } catch (err) {
        throw new Error(
            `vueFileReader requires ${supportedTypeScript} to be installed`,
            { cause: err },
        );
    }
    const { default: compilerApi = typescriptModule } = typescriptModule as {
        default?: unknown;
    };
    const { createSourceFile, version } = compilerApi as {
        createSourceFile?: unknown;
        version?: unknown;
    };
    if (typeof createSourceFile === "function") {
        return;
    }
    const installedVersion = typeof version === "string" ? version : "unknown";
    throw new Error(
        `vueFileReader requires the TypeScript compiler API (${supportedTypeScript}) but the installed "typescript" (version ${installedVersion}) does not provide it. TypeScript 7 and later only provide the native compiler.`,
    );
}

async function importTranslateApi(): Promise<TranslateApiModule> {
    await assertTypeScriptCompilerApi();
    try {
        return await import("./translate-api");
    } catch (err) {
        throw new Error(
            `vueFileReader failed to load "vue-component-meta" (requires ${supportedTypeScript})`,
            { cause: err },
        );
    }
}

/**
 * Load the component API extractor, only once.
 *
 * @internal
 */
export function loadTranslateAPI(): Promise<TranslateApiModule> {
    translateApiModule ??= importTranslateApi();
    return translateApiModule;
}
