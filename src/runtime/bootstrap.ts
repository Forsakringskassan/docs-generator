// bootstrap runtime: part of the runtime that is run before other scripts (placed in head)

import { withCookieConsent } from "./with-cookie-consent";

declare global {
    interface Window {
        withCookieConsent(callback: () => void): void;
    }
}

/* eslint-disable-next-line unicorn/no-global-object-property-assignment -- technical debt */
window.withCookieConsent = withCookieConsent;
