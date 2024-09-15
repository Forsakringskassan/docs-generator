import { type MOTDApi } from "./motd-api";
import { motdSymbol } from "./motd-symbol";

export { type MOTDApi } from "./motd-api";
export { type MOTDMessage } from "./motd-message";

/**
 * A runtime proxy for the motd api. When the `motdProcessor(..)` is installed
 * the calls are routed to the actual API implementation or when not installed
 * it gives useful error messages.
 *
 * @public
 */
export const motdProxy: MOTDApi = {
    get enabled() {
        return Boolean(window[motdSymbol]);
    },
    showMessage(...args) {
        if (window[motdSymbol]) {
            window[motdSymbol].showMessage(...args);
        } else {
            throw new Error(
                "motdProcessor(..) not enabled, cannot call showMessage(..)!",
            );
        }
    },
};
