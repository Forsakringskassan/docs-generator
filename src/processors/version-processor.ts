import { type Processor } from "../processor";

/**
 * Injects the package name and version into the document.
 *
 * @public
 */
export function versionProcessor(
    pkg: { name: string; version: string },
    container: string,
): Processor {
    return {
        name: "version-processor",
        after: "generate-docs",
        handler(context) {
            context.addTemplateBlock(container, "version", {
                filename: "partials/version.html",
                data: { pkg },
            });
        },
    };
}
