function forceReflow(element: HTMLElement): void {
    element.style.display = "none";
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Reading 'offsetHeight' forces a browser reflow/repaint
    element.offsetHeight;
    element.style.removeProperty("display");
}

/**
 * @internal
 * @param event -- EventTarget
 * @returns -- void
 */
export function onToggle(event: EventTarget | null): void {
    if (!event) {
        return;
    }
    const targetDetails = event as HTMLDetailsElement;

    if (targetDetails.tagName !== "DETAILS") {
        return;
    }

    if (targetDetails.open) {
        return;
    }

    const openChildren =
        targetDetails.querySelectorAll<HTMLDetailsElement>("details[open]");

    openChildren.forEach((child) => {
        child.removeAttribute("open");
    });

    const parentList = targetDetails.closest<HTMLElement>("ul");

    if (!parentList) {
        return;
    }

    forceReflow(parentList);
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
export function initCloseDetailMenu(): void {
    const mobileNav = document.querySelector<HTMLElement>(
        ".docs-mobile-nav-wrapper",
    );
    if (!mobileNav) {
        return;
    }
    mobileNav.addEventListener(
        "toggle",
        ({ target }) => {
            onToggle(target);
        },
        {
            capture: true,
        },
    );
}
