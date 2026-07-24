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
import { searchProcessor } from "./search";

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
    searchProcessor(),
    selectableVersionProcessor({ name: "", version: "" }, ""),
    sourceUrlProcessor({ urlFormat: "" }),
    topnavProcessor("", ""),
    versionProcessor({ name: "", version: "", homepage: "" }, ""),
];
