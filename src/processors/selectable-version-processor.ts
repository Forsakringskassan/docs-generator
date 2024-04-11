import { type Processor } from "../processor";

/**
 * Make it possible to change version.
 *
 * @public
 */
export function selectableVersionProcessor(
    pkg: { name: string; version: string },
    container: string,
): Processor {
    return {
        name: "selectable-version-processor",
        after: "generate-docs",
        handler(context) {
            context.addTemplateBlock(container, "version", {
                filename: "partials/selectable-version.html",
                data: { pkg },
            });
        },
    };
}
