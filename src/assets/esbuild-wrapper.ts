import {
    type BuildOptions,
    type BuildResult,
    build as originalBuild,
} from "esbuild";

/**
 * Wraps the call to esbuild so we can mock it in test-cases.
 *
 * @internal
 */
export function esbuild(options: BuildOptions): Promise<BuildResult> {
    return originalBuild(options);
}
