/**
 * Detects if the current device runs on iOS (iPhone, iPod, or iPad).
 * Includes a check for newer iPads that mask themselves as macOS desktop devices.
 *
 * @returns  True if the device is running iOS/iPadOS.
 */
function isIOS(): boolean {
    const userAgent = window.navigator.userAgent.toLowerCase();

    // Keep regex here since we are matching multiple options using the pipe (|)
    const isIPhone = /iphone|ipod/.test(userAgent);

    // ESLINT FIX: Use String.prototype.includes() for simple substring matching
    const isIPad =
        userAgent.includes("ipad") ||
        (window.navigator.platform === "MacIntel" &&
            window.navigator.maxTouchPoints > 1);

    return isIPhone || isIPad;
}

/**
 * Fixes a known WebKit rendering bug on iOS where nested <details> elements
 * fail to repaint/render their children properly when a parent menu is collapsed and re-opened.
 *
 * By programmatically closing all child <details> elements when a parent collapses,
 * we force WebKit to trigger a clean layout pass the next time the menu is opened.
 *
 * This workaround is restricted to iOS devices to maintain standard desktop behavior and optimize performance.
 */
export function initCloseMenuForIOS(): void {
    // Exit early if the device is not running iOS (safeguards performance on other platforms)
    if (!isIOS()) {
        return;
    }

    const mobileNav = document.querySelector<HTMLElement>(
        ".docs-mobile-nav-wrapper",
    );
    if (!mobileNav) {
        return;
    }

    mobileNav.addEventListener(
        "toggle",
        (event: Event) => {
            const targetDetails = event.target as HTMLDetailsElement;

            // Ensure the event originated from a <details> element
            if (targetDetails.tagName !== "DETAILS") {
                return;
            }

            // Exit early if the menu section was OPENED
            if (targetDetails.open) {
                return;
            }

            // FIX: Find ALL nested <details> elements that are open inside this collapsed container
            const openChildren =
                targetDetails.querySelectorAll<HTMLDetailsElement>(
                    "details[open]",
                );

            openChildren.forEach((child) => {
                child.removeAttribute("open");
            });

            const parentList = targetDetails.closest<HTMLElement>(
                ".docs-mobile-nav__list",
            );

            // Early return to satisfy 'unicorn/prefer-early-return'
            if (!parentList) {
                return;
            }

            // Store the current display value safely
            const currentDisplay = parentList.style.display;

            // Temporarily hide the list to prepare for the WebKit layout reset
            parentList.style.display = "none";

            // ESLINT FIX: Reading the property triggers reflow.
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Reading 'offsetHeight' forces a browser reflow/repaint
            parentList.offsetHeight;

            // Restore the original display value
            parentList.style.display = currentDisplay;
        },
        { capture: true },
    );
}
