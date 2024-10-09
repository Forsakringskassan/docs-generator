import util from "node:util";
import { type Processor } from "../processor";

/**
 * Options for {@link motdProcessor}.
 *
 * @public
 */
export interface MOTDOptions {
    /** Enables/disables the MOTD processor. */
    enabled?: boolean;
    /** Name of the container to render content in. */
    container?: string;
    /** Message to display */
    message?: string;
}

/**
 * @internal
 */
export interface MOTDProcessorTemplateData {
    message: string | undefined;
}

interface NormalizedMOTDOptions {
    enabled: boolean;
    container: string;
    message: string | undefined;
}

function normalizeOptions(options: MOTDOptions): NormalizedMOTDOptions {
    const defaults = {
        enabled: true,
        container: "body:begin",
        message: undefined,
    };
    return { ...defaults, ...options };
}

/**
 * Display a MOTD style message.
 *
 * @public
 */
export function motdProcessor(options: MOTDOptions): Processor {
    const { enabled, container, message } = normalizeOptions(options);
    return {
        name: "motd-processor",
        after: "generate-docs",
        runtime: [{ src: "src/runtime/motd/index.ts" }],
        handler(context) {
            if (!enabled) {
                return;
            }

            const useLegacyTemplate = context.hasTemplate(
                "partials/version-banner.html",
            );
            const data: MOTDProcessorTemplateData = {
                message,
            };

            context.addTemplateBlock(container, "motd-container", {
                filename: "partials/motd-container.njk.html",
                data: useLegacyTemplate ? undefined : data,
            });

            /* legacy for backwards compatibility */
            if (useLegacyTemplate) {
                /* eslint-disable-next-line no-console -- expected to log */
                console.warn(
                    `[deprecated] using the "partial/version-banner.html" template for motdProcessor is deprecated`,
                );
                context.addTemplateBlock(container, "version-banner", {
                    filename: "partials/version-banner.html",
                    data,
                });
            }
        },
    };
}

function versionBannerProcessorDeprecated(
    message: string,
    container: string,
): Processor {
    return motdProcessor({
        enabled: true,
        container,
        message,
    });
}

/**
 * Display a banner with message when path dosen't start with /latest.
 *
 * @param message - Message to display in banner, may contain html-template.
 * @param container - Where the content will be inserted.
 *
 * @public
 * @deprecated Use the `motdProcessor` instead.
 */
export const versionBannerProcessor = util.deprecate(
    versionBannerProcessorDeprecated,
    "versionBannerProcessor() is deprecated, use motdProcessor() instead",
) as (message: string, container: string) => Processor;
