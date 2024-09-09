import { ProcessorOptions, type Processor } from "../processor";
import { Component } from "../document";
import { getExampleImport } from "../examples";
import { gitCommitHash, interpolate } from "../utils";

/**
 * Options for {@link sourceUrlProcessor}.
 *
 * @public
 */
export interface SourceUrlProcessorOptions extends ProcessorOptions {
    readonly urlFormat: string;
    /** File extension used for finding component by name */
    readonly componentFileExtension?: string;
}

/**
 * Processor that provide `componentSourceUrl` template function used for resolving
 * component source urls.
 *
 * @public
 */
export function sourceUrlProcessor(
    options: SourceUrlProcessorOptions,
): Processor {
    const {
        enabled = true,
        urlFormat,
        componentFileExtension = "vue",
    } = options;

    return {
        after: "generate-docs",
        name: "source-url-processor",
        async handler(context) {
            if (!enabled) {
                return;
            }

            const hash = (await gitCommitHash("full")) ?? "";
            const short = (await gitCommitHash("short")) ?? "";

            function componentSourceUrl(
                component: Component,
            ): string | undefined {
                const { source, name } = component;
                const filename = source ?? `${name}.${componentFileExtension}`;
                const path = getExampleImport(["./"], filename);
                return interpolate(urlFormat, { path, hash, short });
            }

            context.setTemplateData("componentSourceUrl", componentSourceUrl);
        },
    };
}
