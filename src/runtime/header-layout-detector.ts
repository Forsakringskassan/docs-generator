/**
 * Detects when header layout changes between 1 row and 2 rows
 * based on whether left and right sections fit on the same row
 */

/**
 * Parses a string value representing pixels and converts it into a number.
 *
 * If the provided string is empty, it returns the specified default value.
 *
 * @param value - The pixel string to be parsed (e.g., "16px" or "").
 * @param defaultValue - The fallback value to return if the input string is empty.
 * @internal
 * @returns The parsed number representation of the pixel value, or the default value.
 */
export function parsePx(value: string, defaultValue: number): number {
    const parsed = Number(value.replace("px", ""));
    if (Number.isNaN(parsed)) {
        return defaultValue;
    }
    return parsed;
}

/**
 * Calculates the total width excluding padding.
 * @param header - The header element from the document.
 * @returns The width as a number.
 */
function getContentWidth(header: HTMLDivElement): number {
    const style = window.getComputedStyle(header);
    const headerPaddingLeft = parsePx(style.paddingLeft, 0);
    const headerPaddingRight = parsePx(style.paddingRight, 0);
    const { width } = header.getBoundingClientRect();

    return width - (headerPaddingLeft + headerPaddingRight);
}

function getTopnavMaxWidht(right: HTMLElement): number {
    // let width = 0;
    const rightSlot = right.querySelector(".docs-page-header__right-slot");
    const rightSlotWidth = rightSlot
        ? rightSlot.getBoundingClientRect().width
        : 0;
    const rightWidth = right.getBoundingClientRect().width;
    const rightStyle = getComputedStyle(right);
    const rightGap = parsePx(rightStyle.gap, 0);

    return rightWidth - rightSlotWidth - rightGap;
}

/**
 * Calculates total item width by summing up pre-measured rects.
 */
function getMenuItemsWidth(items: HTMLElement[]): number {
    return items.reduce(
        (total, item) => total + item.getBoundingClientRect().width,
        0,
    );
}

function setMenuItemVisibility(items: HTMLElement[], visible: boolean): void {
    const visibility = visible ? "visible" : "hidden";
    for (const item of items) {
        item.style.visibility = visibility;
    }
}

/**
 * totalNeeded calculates the total width required to fit everything in the header on a single row.
 * headerWidth is the current total width of the header.
 */
function checkLayout(nav: HTMLElement): void {
    /* eslint-disable @typescript-eslint/no-non-null-assertion -- let it crash at runtime if these doesn't actually exist */
    const header = document.querySelector<HTMLDivElement>(
        "header .docs-page-header",
    )!;
    const left = document.querySelector(".docs-page-header__left")!;
    const right = document.querySelector<HTMLElement>(
        ".docs-page-header__right",
    )!;
    const mobileMeny = document.querySelector(".docs-mobile-nav")!;

    const menuItems = Array.from(
        nav.querySelectorAll<HTMLElement>(".docs-topnav__item"),
    );
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    header.classList.remove("is-multi-row", "is-single-row");
    mobileMeny.classList.remove("is-mobile");
    nav.classList.remove("is-mobile");

    const leftWidth = left.getBoundingClientRect().width;
    const rightWidth = right.getBoundingClientRect().width;

    const headerWidth = getContentWidth(header);

    const headerStyle = getComputedStyle(header);
    const headerGap = parsePx(headerStyle.gap, 0);
    // Since we measure in single-row mode, we must add the gap and internal padding
    // to determine if the content fits inside the header's inner width
    const totalNeeded = leftWidth + headerGap + rightWidth;

    const headerFit = totalNeeded < headerWidth;

    header.classList.toggle("is-multi-row", !headerFit);
    header.classList.toggle("is-single-row", headerFit);

    // In multi-row mode, check if the topnav menu fits; if not, toggle to the mobile layout.
    if (!headerFit) {
        const topnavMaxWidth = getTopnavMaxWidht(right);
        const topnavWidth = getMenuItemsWidth(menuItems);

        const topnavFit = topnavWidth < topnavMaxWidth;

        mobileMeny.classList.toggle("is-mobile", !topnavFit);
        nav.classList.toggle("is-mobile", !topnavFit);

        setMenuItemVisibility(menuItems, topnavFit);
    }
}

/**
 * Removes the loading class from the page to make the header visible.
 * Listens for new page selections from the side menu.
 * Attaches a mutation observer to the document.
 * Calls checkLayout to perform calculations for the header.
 */
export function headerLayoutDetector(nav: HTMLElement): void {
    const resizeObserver = new ResizeObserver(() => {
        checkLayout(nav);
    });
    document.documentElement.classList.remove("loading");
    resizeObserver.observe(document.body);
    window.addEventListener("docs:navigation", () => {
        checkLayout(nav);
    });
    checkLayout(nav);
}
