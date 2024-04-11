import { type Processor, type ProcessorOptions } from "../processor";

/**
 * @public
 */
export function livereloadProcessor(options: ProcessorOptions): Processor {
    const { enabled } = options;
    return {
        after: "generate-docs",
        name: "livereload-processor",
        enabled,
        handler(context) {
            context.addTemplateBlock("body:end", "livereload", {
                filename: "partials/livereload.html",
            });
        },
    };
}
