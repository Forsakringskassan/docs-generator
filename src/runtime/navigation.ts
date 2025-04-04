import mermaid from "mermaid";
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
 * Close all nested `<details>` elements.
 */
function closeNested(details: HTMLDetailsElement): void {
    for (const nested of details.querySelectorAll("details")) {
        nested.open = false;
    }
}

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
    const ts = String(new Date().getTime());
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
            copy.src = url.toString();
        }

        /* if the <script> have text content we clone it as well */
        if (script.textContent) {
            copy.textContent = script.textContent;
        }

        script.replaceWith(copy);
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
    const sidenav = doc.querySelector("#sidenav");
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

    /* update external urls in sidenav */
    const anchorSelector = "#sidenav li.link a";
    const anchorLinks =
        document.querySelectorAll<HTMLAnchorElement>(anchorSelector);
    for (const link of anchorLinks) {
        const { rel } = link;
        const { path } = link.dataset;
        if (rel !== "external" || !path) {
            continue;
        }
        link.setAttribute("href", [rootUrl, path].join("/"));
    }

    /* update rootUrl on document root */
    document.documentElement.dataset.rootUrl = rootUrl;

    document.title = doc.title;
    target.replaceWith(element);

    const toc = document.querySelector("#outline");
    if (toc) {
        const headings = document.querySelectorAll("#content h2");
        tableOfContents(toc, headings);
        toggleTableOfContents();
    }

    /* dispatch an event so other components know they might need to update */
    window.dispatchEvent(new Event("docs:navigation"));
}

/**
 * Get parent element unless max depth is reached.
 */
function getParentElement(el: HTMLElement, depth: number): HTMLElement | null {
    if (depth === 0) {
        return null;
    }
    return el?.parentElement?.closest("li.link, li.expandable") ?? null;
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
 * @param navigation - The `<nav>` element in `#sidebar`.
 * @param link - The `<a>` element to install click handler for.
 */
function replaceContentOnClick(
    toggle: HTMLInputElement,
    navigation: HTMLElement,
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

        /* remove old active link */
        const current = navigation.querySelectorAll(".active");
        for (const element of current) {
            element.classList.remove("active");
        }

        /* set new active link */
        for (
            let parent = link.parentElement, maxDepth = 5;
            parent;
            parent = getParentElement(parent, maxDepth--)
        ) {
            parent.classList.add("active");
        }

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
    } else {
        const top = Math.max(-rect.top, 0);
        const bottom = rect.height - Math.max(rect.bottom - clientHeight, 0);
        return bottom - top;
    }
}

/**
 * Update the maximum height of the sidenav.
 *
 * The sidenav height varies depending on how much of the header element is
 * visible.
 */
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
    variableBlock.innerText = /* CSS */ `
        #sidenav {
            --header-footer-visible-height: ${offset}px;
        }
    `;
}

for (const details of document.querySelectorAll("details")) {
    details.addEventListener("toggle", () => {
        if (!details.open) {
            closeNested(details);
        }
    });
}

const toggle = document.querySelector<HTMLInputElement>(
    "#sidenav .sidenav__toggle",
);
const navigation = document.querySelector<HTMLElement>("#sidenav nav");
if (toggle && navigation) {
    const anchorSelector = "#sidenav li.link a";
    const anchorLinks =
        document.querySelectorAll<HTMLAnchorElement>(anchorSelector);
    for (const link of anchorLinks) {
        const { rel } = link;
        if (rel === "external") {
            continue;
        }
        replaceContentOnClick(toggle, navigation, link);
    }

    window.addEventListener("popstate", () => {
        if (previousPath !== location.pathname) {
            replaceContent(location.href);
        }

        previousPath = location.pathname;
    });

    document.head.appendChild(variableBlock);
    updateSidenavHeight(navigation);
    window.addEventListener("scroll", () => {
        updateSidenavHeight(navigation);
    });
    window.addEventListener("resize", () => {
        updateSidenavHeight(navigation);
    });
}
