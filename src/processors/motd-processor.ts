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
    message: string;
}

type NormalizedMOTDOptions = Required<MOTDOptions>;

function normalizeOptions(options: MOTDOptions): NormalizedMOTDOptions {
    const defaults = {
        enabled: true,
        container: "body:begin",
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
        handler(context) {
            if (!enabled) {
                return;
            }
            context.addTemplateBlock(container, "version-banner", {
                filename: "partials/version-banner.html",
                data: { message },
            });
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
