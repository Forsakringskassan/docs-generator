import { type PackageJson } from "../package-json";
import { type ProcessorOptions, type Processor } from "../processor";

/**
 * Make it possible to change version.
 *
 * @public
 */
export function selectableVersionProcessor(
    pkg: PackageJson,
    container: string,
    options?: ProcessorOptions,
): Processor {
    const { enabled = true } = options ?? {};
    return {
        name: "selectable-version-processor",
        after: "generate-docs",
        runtime: [
            {
                src: "src/runtime/select-version.ts",
            },
        ],
        handler(context) {
            if (!enabled) {
                return;
            }
            context.addTemplateBlock(container, "version", {
                filename: "partials/selectable-version.html",
                data: { pkg },
            });
        },
    };
}
