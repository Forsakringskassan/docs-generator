// bootstrap runtime: part of the runtime that is run before other scripts (placed in head)

import { withCookieConsent } from "./with-cookie-consent";

declare global {
    interface Window {
        withCookieConsent(callback: () => void): void;
    }
}

window.withCookieConsent = withCookieConsent;
