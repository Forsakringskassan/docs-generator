import { ProcessorOptions, type Processor } from "../processor";
import { Component } from "../document";
import { type PackageJson } from "../package-json";
import {
    getRepositoryUrl,
    gitCommitHash,
    interpolate,
    fileMatcher,
} from "../utils";

/**
 * Options for {@link sourceUrlProcessor#}.
 *
 * @public
 */
export interface SourceUrlProcessorOptions extends ProcessorOptions {
    /** List of glob patterns matching source files */
    readonly sourceFiles?: string[];

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
    pkg: PackageJson,
    options: SourceUrlProcessorOptions,
): Processor;

/**
 * Processor that provide `componentSourceUrl` template function used for resolving
 * component source urls.
 *
 * @public
 */
export function sourceUrlProcessor(
    options: SourceUrlProcessorOptions,
): Processor;

export function sourceUrlProcessor(
    ...args:
        | [PackageJson, SourceUrlProcessorOptions]
        | [SourceUrlProcessorOptions]
): Processor {
    const pkg = args.length === 2 ? args[0] : {};
    const options = args.length === 2 ? args[1] : args[0];
    const {
        enabled = true,
        sourceFiles = ["**/*"],
        urlFormat,
        componentFileExtension = "vue",
    } = options;

    const repository = getRepositoryUrl(pkg) ?? "";
    const matcher = fileMatcher(sourceFiles);

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
                const path = matcher(filename, "when generating source url");
                return interpolate(urlFormat, {
                    path,
                    hash,
                    short,
                    repository,
                });
            }

            context.setTemplateData("componentSourceUrl", componentSourceUrl);
        },
    };
}
