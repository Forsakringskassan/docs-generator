import { onContentReady } from "./on-content-ready";
import { BREAKPOINT_LARGE } from "./breakpoints";

export function tableOfContents(
    toc: Element,
    headings: NodeListOf<Element>,
): void {
    function visibilityChange(entries: IntersectionObserverEntry[]): void {
        for (const { target, isIntersecting } of entries) {
            if (!isIntersecting) {
                continue;
            }
            for (const li of toc.querySelectorAll("li.active")) {
                li.classList.remove("active");
            }
            const href = `#${target.id}`;
            const link = toc.querySelector(`a[href="${href}"]`);
            const li = link?.closest("li");
            li?.classList.add("active");
        }
    }

    const options = {
        root: null,
        rootMargin: "0px 0px -80%",
        threshold: 1.0,
    };

    const observer = new IntersectionObserver(visibilityChange, options);
    for (const heading of headings) {
        observer.observe(heading);
    }
}

onContentReady(() => {
    const toc = document.querySelector("#outline");
    const headings = document.querySelectorAll("#content h2");

    if (!toc) {
        return;
    }

    tableOfContents(toc, headings);
});

const tableOfContentsQuery = window.matchMedia(
    `(min-width: ${BREAKPOINT_LARGE})`,
);
tableOfContentsQuery.addEventListener("change", toggleTableOfContents);

// Set initial state of toc on page load.
toggleTableOfContents();

export function toggleTableOfContents(): void {
    const toc = document.querySelector("#outline");
    if (!toc) {
        return;
    }

    const { matches } = tableOfContentsQuery;
    const isOpen = toc.hasAttribute("open");
    if (matches && !isOpen) {
        toc.setAttribute("open", "");
    } else if (!matches && isOpen) {
        toc.removeAttribute("open");
    }
}
