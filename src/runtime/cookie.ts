import { onContentReady } from "./on-content-ready";

function hasCookie(name: string): boolean {
    return document.cookie
        .split("; ")
        .some((row) => row.startsWith(`${name}=`));
}

function showCookieWarning(el: HTMLElement): void {
    el.style.display = "block";
}

function hideCookieWarning(el: HTMLElement): void {
    el.style.display = "none";
}

function setCookie(name: string): void {
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 400);
    document.cookie = `${name}=;expires=${expires.toString()};path=/`;
}

onContentReady(() => {
    const el = document.querySelector<HTMLElement>(".cookie-warning");
    if (!el) {
        return;
    }

    if (!hasCookie("doc-hide-cookie-warning")) {
        showCookieWarning(el);

        const consentAllButton = document.querySelector<HTMLButtonElement>(
            "#consent-all-button",
        );
        if (consentAllButton) {
            consentAllButton.addEventListener("click", () => {
                setCookie("doc-hide-cookie-warning");
                setCookie("doc-cookie-consent");
                hideCookieWarning(el);
                window.dispatchEvent(new Event("doc-cookie-consent"));
            });
        }

        const consentFunctionalButton = document.querySelector(
            "#consent-functional-button",
        );
        if (consentFunctionalButton) {
            consentFunctionalButton.addEventListener("click", () => {
                setCookie("doc-hide-cookie-warning");
                hideCookieWarning(el);
            });
        }
    }
});
