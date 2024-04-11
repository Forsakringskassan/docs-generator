import { type Processor, type ProcessorOptions } from "../processor";

/**
 * @public
 */
export interface MatomoOptions {
    /** Matomo Site ID */
    siteId: string;
    /** Matomo API URL */
    apiUrl: string;
    /** Matomo Tracker URL */
    trackerUrl: string;
    /** Site hostname (analytics will be disabled if the hostname of the running
     * site does not match one of the configured hostnames) */
    hostname?: string | string[];
}

function toArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}

/**
 * @public
 */
export function matomoProcessor(
    options: MatomoOptions & ProcessorOptions,
): Processor {
    const { enabled, siteId, apiUrl, trackerUrl, hostname } = options;
    return {
        after: "generate-docs",
        name: "matomo-processor",
        enabled,
        handler(context) {
            context.addTemplateBlock("head", "matomo", {
                filename: "partials/matomo.html",
                data: {
                    siteId,
                    apiUrl,
                    trackerUrl,
                    hostname: hostname ? toArray(hostname) : [],
                },
            });
        },
    };
}
