import { type Processor } from "../processor";

/**
 * Display a banner with message when path dosen't start with /latest.
 * @param message - Message to display in banner, may contain html-template.
 *
 * @public
 */
export function versionBannerProcessor(
    message: string,
    container: string,
): Processor {
    return {
        name: "version-banner-processor",
        after: "generate-docs",
        handler(context) {
            context.addTemplateBlock(container, "version-banner", {
                filename: "partials/version-banner.html",
                data: { message },
            });
        },
    };
}
