import {
    type BuildOptions,
    type BuildResult,
    build as originalBuild,
} from "esbuild";

/**
 * Wraps the call to esbuild so we can mock it in test-cases. We don't have a
 * proper working Jest ESM configuration yet so constructs such as
 * `jest.mock(..)` does not work.
 *
 * @internal
 */
export function esbuild(options: BuildOptions): Promise<BuildResult> {
    return originalBuild(options);
}
