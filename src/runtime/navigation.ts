import mermaid from "mermaid";
import { closeNested } from "./close-all-details";
import { tableOfContents, toggleTableOfContents } from "./table-of-contents";

declare global {
    interface WindowEventMap {
        "docs:navigation": Event;
    }
}

const parser = new DOMParser();
const variableBlock = document.createElement("style");

/* eslint-disable @typescript-eslint/no-non-null-assertion -- let it crash at runtime if these doesn't actually exist */
const header = document.querySelector("header")!;
const footer = document.querySelector("footer")!;
/* eslint-enable @typescript-eslint/no-non-null-assertion */

// Save path to manage whether to replace content for new page or navigate to hash.
let previousPath = location.pathname;

/**
 * Clone script tags inside given element.
 *
 * Scripts does not automatically get executed when cloned (its internal
 * "already started" flag is set) so we manually swap out the script elements
 * with new fresh elements.
 *
 * @param element - The root element from which script elements are found and replaced.
 * @param href - The url which the src attribute should be relative to.
 */
function cloneScripts(element: HTMLElement, href: string): void {
    const ts = String(Date.now());
    for (const script of element.querySelectorAll("script")) {
        const copy = document.createElement("script");
        const src = script.getAttribute("src");
        const type = script.getAttribute("type");

        if (type) {
            copy.setAttribute("type", type);
        }

        /* script.src is normalized but in wrong folder so we rewrite the url
         * based on the new updated href */
        if (src) {
            const url = new URL(src, href);
            url.searchParams.append("ts", ts);
            copy.src = url.href;
        }

        /* if the <script> have text content we clone it as well */
        if (script.textContent) {
            copy.textContent = script.textContent;
        }

        script.replaceWith(copy);
    }
}

/**
 * Set the link and every group containing it as active and expand those
 * groups so the link is visible.
 *
 * @param navigation - The `<nav>` element in the sidenav.
 * @param link - The `<a>` element in the sidenav to mark as active.
 */
function setActive(navigation: Element, link: HTMLAnchorElement): void {
    const listItem = link.closest("li");
    if (!listItem) {
        return;
    }
    listItem.classList.add("active");

    const groups = navigation.querySelectorAll("li.expandable");
    for (const group of groups) {
        if (!group.contains(link)) {
            continue;
        }
        group.classList.add("active");

        const details =
            group.querySelector<HTMLDetailsElement>(":scope > details");
        if (details) {
            details.open = true;
        }
    }
}

/**
 * Update the sidenav for the page being navigated to: making link hrefs
 * relative to the new page and setting the new page's link as active.
 *
 * @param newPage - The parsed document of the page being navigated to.
 */
function updateSidenav(newPage: Document): void {
    const navigation = document.querySelector("#docs-sidenav nav");
    if (!navigation) {
        return;
    }

    for (const element of navigation.querySelectorAll(".active")) {
        element.classList.remove("active");
    }

    const links = navigation.querySelectorAll<HTMLAnchorElement>(
        "li.link a[data-path]",
    );
    for (const link of links) {
        const { path } = link.dataset;
        if (!path) {
            continue;
        }

        const newPageLink = newPage.querySelector(
            `#docs-sidenav a[data-path="${CSS.escape(path)}"]`,
        );
        if (!newPageLink) {
            continue;
        }

        const href = newPageLink.getAttribute("href");
        if (href) {
            link.setAttribute("href", href);
        }

        const isActiveOnNewPage =
            newPageLink.closest("li.link.active") !== null;
        if (isActiveOnNewPage) {
            setActive(navigation, link);
        }
    }
}

/**
 * Replaces the content of `<main>` with the given URL.
 *
 * If the request fails the entire `<body>` is replaced.
 *
 * @param href - The URL to fetch content from.
 * @returns A promise resolved when the content has been updated.
 */
async function replaceContent(href: string): Promise<void> {
    const response = await fetch(href);
    const body = await response.text();
    const doc = parser.parseFromString(body, "text/html");
    const sidenav = doc.querySelector("#docs-sidenav");
    const rootUrl = doc.documentElement.dataset.rootUrl;

    /* replace only <main> if the response is OK and the sidenav is present on
     * the new page */
    const selector = response.ok && sidenav ? "main" : "body";

    /* eslint-disable @typescript-eslint/no-non-null-assertion -- let it crash at runtime if these doesn't actually exist */
    const header = doc.querySelector("header")!;
    const footer = doc.querySelector("footer")!;
    const headerTarget = document.querySelector("header")!;
    const footerTarget = document.querySelector("footer")!;
    const target = document.querySelector(selector)!;
    const foreign = doc.querySelector(selector)!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    const element = document.importNode(foreign, true);
    cloneScripts(element, href);

    if (response.ok) {
        const importedHeader = document.importNode(header, true);
        cloneScripts(importedHeader, href);
        headerTarget.replaceWith(importedHeader);
        footerTarget.replaceWith(footer);
    }

    updateSidenav(doc);

    /* update rootUrl on document root */
    document.documentElement.dataset.rootUrl = rootUrl;

    document.title = doc.title;
    target.replaceWith(element);

    const toc = document.querySelector("#docs-outline");
    if (toc) {
        const headings = document.querySelectorAll("#docs-content h2");
        tableOfContents(toc, headings);
        toggleTableOfContents();
    }

    /* dispatch an event so other components know they might need to update */
    window.dispatchEvent(new Event("docs:navigation"));
}

function hasModifierkey(event: MouseEvent): boolean {
    return event.ctrlKey || event.altKey || event.metaKey || event.shiftKey;
}

/**
 * Installs a click handler to dynamically replace the content of `<main>`
 * instead of navigation as usual. This preserves the state of expanded groups,
 * menu scrolling etc.
 *
 * @param toggle - The toggle element in `#sidebar`.
 * @param link - The `<a>` element to install click handler for.
 */
function replaceContentOnClick(
    toggle: HTMLInputElement,
    link: HTMLAnchorElement,
): void {
    const { href } = link;
    link.addEventListener("click", async (event) => {
        /* ignore clicks with a modifier */
        if (hasModifierkey(event)) {
            return;
        }

        event.preventDefault();
        await replaceContent(href);
        history.pushState("", "", href);

        previousPath = location.pathname;

        window.scrollTo({ top: 0, behavior: "smooth" });

        /* move focus */
        const heading = document.querySelector<HTMLElement>("main h1");
        if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus();
        }

        /* rerender mermaid diagrams */
        mermaid.contentLoaded();

        /* hide sidebar on content switch */
        toggle.checked = false;
    });
}

function getVisibleHeight(el: HTMLElement): number {
    const { clientHeight } = document.documentElement;
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > clientHeight) {
        return 0;
    }
    const top = Math.max(-rect.top, 0);
    const bottom = rect.height - Math.max(rect.bottom - clientHeight, 0);
    return Math.floor(bottom - top);
}

/**
 * Update the maximum height of the sidenav.
 *
 * The sidenav height varies depending on how much of the header element is
 * visible.
 */
/* eslint-disable-next-line unicorn/no-unnecessary-parameters -- false positive but should refactor so the parameter isn't stored in the outer scope */
function updateSidenavHeight(navigation: HTMLElement): void {
    const { clientHeight } = document.documentElement;
    const navHeight = navigation.getBoundingClientRect().height;
    const headerHeight = getVisibleHeight(header);
    const footerHeight = getVisibleHeight(footer);
    const offset = (() => {
        if (headerHeight > 0) {
            return headerHeight;
        }
        if (navHeight < clientHeight) {
            return footerHeight;
        }
        return 0;
    })();
    variableBlock.textContent = /* CSS */ `
        #docs-sidenav {
            --header-footer-visible-height: ${String(offset)}px;
        }
    `;
}

for (const details of document.querySelectorAll("details")) {
    details.addEventListener("toggle", () => {
        closeNested(details);
    });
}

const toggle = document.querySelector<HTMLInputElement>(
    "#docs-sidenav .sidenav__toggle",
);
const navigation = document.querySelector<HTMLElement>("#docs-sidenav nav");
if (toggle && navigation) {
    const anchorSelector = "#docs-sidenav li.link a";
    const anchorLinks =
        document.querySelectorAll<HTMLAnchorElement>(anchorSelector);
    for (const link of anchorLinks) {
        const { rel } = link;
        if (rel === "external") {
            continue;
        }
        replaceContentOnClick(toggle, link);
    }

    window.addEventListener("popstate", () => {
        if (previousPath !== location.pathname) {
            /* eslint-disable-next-line @typescript-eslint/no-floating-promises -- technical debt */
            replaceContent(location.href);
        }

        openActiveTab();
        previousPath = location.pathname;
    });

    document.head.append(variableBlock);
    updateSidenavHeight(navigation);
    window.addEventListener("scroll", () => {
        updateSidenavHeight(navigation);
    });
    window.addEventListener("resize", () => {
        updateSidenavHeight(navigation);
    });
}

window.addEventListener("DOMContentLoaded", openActiveTab);

/**
 * When navigating to an element using URL.
 * If the element is inside a non-active tab it will be activated.
 */
function openActiveTab(): void {
    if (!location.hash) {
        return;
    }

    const element = document.querySelector(location.hash);
    const tabPanel = element?.closest(".docs-tabpanel");

    if (!tabPanel?.classList.contains("hidden-tabpanel")) {
        return;
    }

    const tab = tabPanel.parentElement?.querySelector<HTMLElement>(
        `[aria-controls="${tabPanel.id}"]`,
    );
    tab?.click(); // Activate the tab the element is inside.
}
