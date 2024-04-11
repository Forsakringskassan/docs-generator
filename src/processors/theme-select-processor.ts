import { type Processor } from "../processor";

/**
 * Injects a theme selector into the toolbar.
 *
 * @public
 */
export function themeSelectProcessor(): Processor {
    return {
        name: "theme-select-processor",
        after: "generate-docs",
        handler(context) {
            context.addTemplateBlock("toolbar", "theme-select", {
                filename: "partials/theme-select.html",
            });
        },
    };
}
