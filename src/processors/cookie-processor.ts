import { type Processor, type ProcessorOptions } from "../processor";

/**
 * Processor that displays cookie warning.
 *
 * @public
 */
export function cookieProcessor(options: ProcessorOptions = {}): Processor {
    const { enabled = true } = options;

    return {
        after: "generate-docs",
        name: "cookie-processor",
        handler(context) {
            if (!enabled) {
                return;
            }

            context.addTemplateBlock("body:begin", "cookie-warning", {
                filename: "partials/cookie-warning.html",
            });
        },
    };
}
