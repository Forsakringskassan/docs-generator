import { matomoProcessor } from "./matomo";
import {
    cookieProcessor,
    manifestProcessor,
    motdProcessor,
    selectableVersionProcessor,
    sourceUrlProcessor,
    topnavProcessor,
    versionProcessor,
} from "./processors";

/**
 * Used by build-script to find all runtime scripts that needs compilation.
 *
 * @internal
 */
export const availableProcessors = [
    cookieProcessor(),
    manifestProcessor(),
    matomoProcessor({ siteId: "", trackerUrl: "" }),
    motdProcessor({ message: "" }),
    selectableVersionProcessor({ name: "", version: "" }, ""),
    sourceUrlProcessor({ urlFormat: "" }),
    topnavProcessor("", ""),
    versionProcessor({ name: "", version: "", homepage: "" }, ""),
];
