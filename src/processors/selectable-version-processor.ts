import { type ProcessorOptions, type Processor } from "../processor";

/**
 * Make it possible to change version.
 *
 * @public
 */
export function selectableVersionProcessor(
    pkg: { name: string; version: string },
    container: string,
    options?: ProcessorOptions,
): Processor {
    const { enabled = true } = options ?? {};
    return {
        name: "selectable-version-processor",
        after: "generate-docs",
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
