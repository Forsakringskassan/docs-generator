import { onContentReady } from "./on-content-ready";

/**
 * Executes callback when cookie consent is given.
 *
 * If cookie processor is not enabled, the callback is run immediatly.
 *
 * @internal
 */
export function withCookieConsent(callback: () => void): void {
    function hasCookie(name: string): boolean {
        return document.cookie
            .split("; ")
            .some((row) => row.startsWith(`${name}=`));
    }

    onContentReady(() => {
        if (!document.querySelector(".cookie-warning")) {
            callback();
            return;
        }

        if (!navigator.cookieEnabled) {
            return;
        }

        if (hasCookie("doc-cookie-consent")) {
            callback();
            return;
        }

        const registeredUrl = window.location.href;
        window.addEventListener(
            "doc-cookie-consent",
            () => {
                if (window.location.href === registeredUrl) {
                    callback();
                }
            },
            {
                once: true,
            },
        );
    });
}
