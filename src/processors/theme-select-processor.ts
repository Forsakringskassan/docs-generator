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
            const sessionKey = "fkds-theme";
            const data = {
                defaultTheme: "exp",
                sessionKey,
            };

            /* workaround to prevent flickering theme, inject a render-blocking script enabling the appropriate theme */
            context.addTemplateBlock("head", "theme-render-blocker", {
                filename: "partials/theme-render-blocker.html",
                data,
            });

            context.addTemplateBlock("toolbar", "theme-select", {
                filename: "partials/theme-select.html",
                data,
            });
        },
    };
}
