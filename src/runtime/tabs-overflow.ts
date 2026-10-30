export function setupOverflow(
    tablistWrapper: HTMLElement,
    tabList: HTMLElement,
): void {
    const leftButton = createOverflowArrowButton("left");
    leftButton.addEventListener("click", () => {
        scrollWithOverflowButton(tabList, "left");
    });
    tablistWrapper.insertBefore(leftButton, tablistWrapper.firstChild);

    const rightButton = createOverflowArrowButton("right");
    rightButton.addEventListener("click", () => {
        scrollWithOverflowButton(tabList, "right");
    });

    tablistWrapper.append(rightButton);

    const resizeObserver = new ResizeObserver(() => {
        updateOverflowButtonsVisibility(tabList);
    });
    resizeObserver.observe(tabList);

    updateOverflowButtonsVisibility(tabList);
}

export function isTabCutOffLeft(tabListRect: DOMRect, tab: Element): boolean {
    return tab.getBoundingClientRect().left < tabListRect.left - 1; // 1px error margin
}

export function isTabCutOffRight(tabListRect: DOMRect, tab: Element): boolean {
    return tab.getBoundingClientRect().right > tabListRect.right + 1; // 1px error margin
}

export function scrollOverflow(
    tablist: HTMLElement,
    tab: Element,
    direction: "left" | "right",
): void {
    // Prescroll a bit to trigger buttons to disappear for
    // calculation to be correct when scrolling fully.
    if (direction === "left") {
        tablist.scrollLeft -= 1;
    } else {
        tablist.scrollLeft += 1;
    }
    updateOverflowButtonsVisibility(tablist);
    scrollToTab(tablist, tab, direction);
    updateOverflowButtonsVisibility(tablist);
}

export function updateOverflowButtonsVisibility(tabList: HTMLElement): void {
    const leftButton = document.querySelector<HTMLButtonElement>(
        ".docs-tabs .docs-tabs-more-button--left",
    );
    const rightButton = document.querySelector<HTMLButtonElement>(
        ".docs-tabs .docs-tabs-more-button--right",
    );
    if (!leftButton || !rightButton) {
        return;
    }

    const showRightButton =
        tabList.scrollWidth - tabList.clientWidth - tabList.scrollLeft > 1; // 1px error margin
    rightButton.hidden = !showRightButton;
    const showLeftButton = tabList.scrollLeft > 0;
    leftButton.hidden = !showLeftButton;
}

function scrollWithOverflowButton(
    tabList: HTMLElement,
    direction: "left" | "right",
): void {
    const tab = findArrowToTab(tabList, direction);
    if (!tab) {
        return;
    }

    scrollOverflow(tabList, tab, direction);
}

function scrollToTab(
    tabList: HTMLElement,
    tab: Element,
    direction: "left" | "right",
): void {
    const tabListRect = tabList.getBoundingClientRect();

    // Scroll so that the hidden tab is visible
    if (direction === "right") {
        tabList.scrollLeft +=
            tab.getBoundingClientRect().right - tabListRect.right;
    } else {
        tabList.scrollLeft -=
            tabListRect.left - tab.getBoundingClientRect().left;
    }
}

function findArrowToTab(
    tabList: HTMLElement,
    direction: "left" | "right",
): Element | undefined {
    const tabs = Array.from(tabList.children);
    const tabListRect = tabList.getBoundingClientRect();

    if (direction === "right") {
        const nextTab = tabs.find((tab) => {
            return isTabCutOffRight(tabListRect, tab);
        });

        return nextTab;
    }
    const prevTab = [...tabs].findLast((tab) => {
        return isTabCutOffLeft(tabListRect, tab);
    });

    return prevTab;
}

function createOverflowArrowButton(
    direction: "left" | "right",
): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.hidden = true;
    button.classList.add(
        "docs-tabs-more-button",
        `docs-tabs-more-button--${direction}`,
    );
    button.setAttribute("aria-hidden", "true");
    button.tabIndex = -1;

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.classList.add(
        "docs-tabs-more-icon",
        `docs-tabs-more-icon--${direction}`,
    );
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#docs-icon-arrow-down");
    icon.append(use);
    button.append(icon);

    return button;
}
