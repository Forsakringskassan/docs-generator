export function setupOverflow(
    tablistWrapper: HTMLElement,
    tabList: HTMLElement,
): void {
    const leftButton = createOverflowArrowButton("left");
    leftButton.onclick = () => {
        scrollWithOverflowButton(tabList, leftButton, rightButton, "left");
    };
    tablistWrapper.insertBefore(leftButton, tablistWrapper.firstChild);

    const rightButton = createOverflowArrowButton("right");
    rightButton.onclick = () => {
        scrollWithOverflowButton(tabList, leftButton, rightButton, "right");
    };

    tablistWrapper.append(rightButton);

    const resizeObserver = new ResizeObserver(() =>
        updateOverflowButtonsVisibility(tabList, leftButton, rightButton),
    );
    resizeObserver.observe(tabList);

    updateOverflowButtonsVisibility(tabList, leftButton, rightButton);
}

function createOverflowArrowButton(
    direction: "left" | "right",
): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.hidden = true;
    button.classList.add("docs-more-button", `docs-more-button--${direction}`);
    button.tabIndex = -1;

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("focusable", "false");
    icon.classList.add("docs-more-icon", `docs-more-icon--${direction}`);
    icon.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#docs-icon-arrow-down");
    icon.append(use);
    button.append(icon);

    return button;
}

function findArrowToTab(
    tabList: HTMLElement,
    direction: "left" | "right",
): Element | undefined {
    const tabs = Array.from(tabList.children);
    const tabListRect = tabList.getBoundingClientRect();

    if (direction === "right") {
        // Find first tab that is cut off to the right
        const nextTab = tabs.find((tab) => {
            return tab.getBoundingClientRect().right > tabListRect.right + 1; // 1px error margin
        });

        return nextTab;
    } else {
        // Find first tab that is cut off to the left
        const prevTab = [...tabs].reverse().find((tab) => {
            return tab.getBoundingClientRect().left < tabListRect.left - 1; // 1px error margin
        });

        return prevTab;
    }
}

function scrollToTab(
    tabList: HTMLElement,
    tab: Element,
    direction: "left" | "right",
): void {
    const tabListRect = tabList.getBoundingClientRect();

    if (direction === "right") {
        // Scroll so that the hidden tab is visible
        tabList.scrollLeft +=
            tab.getBoundingClientRect().right - tabListRect.right;
    } else {
        // Scroll so that the hidden tab is visible
        tabList.scrollLeft -=
            tabListRect.left - tab.getBoundingClientRect().left;
    }
}

function scrollWithOverflowButton(
    tabList: HTMLElement,
    leftButton: HTMLButtonElement,
    rightButton: HTMLButtonElement,
    direction: "left" | "right",
) {
    const tab = findArrowToTab(tabList, direction);
    if (!tab) {
        return;
    }

    // Prescroll a bit to trigger buttons to disappear for
    // caluclation to be correct when scrolling fully.
    if (direction == "left") {
        tabList.scrollLeft -= 1;
    } else {
        tabList.scrollLeft += 1;
    }
    updateOverflowButtonsVisibility(tabList, leftButton, rightButton);
    scrollToTab(tabList, tab, direction);
    updateOverflowButtonsVisibility(tabList, leftButton, rightButton);
}

function updateOverflowButtonsVisibility(
    tabList: HTMLElement,
    leftButton: HTMLButtonElement,
    rightButton: HTMLButtonElement,
) {
    const showRightButton =
        tabList.scrollWidth - tabList.clientWidth - tabList.scrollLeft > 1; // 1px error margin
    rightButton.hidden = !showRightButton;
    (rightButton.firstChild as SVGSVGElement).setAttribute(
        "aria-hidden",
        `${!showRightButton}`,
    );
    const showLeftButton = tabList.scrollLeft > 1; // 1px error margin
    leftButton.hidden = !showLeftButton;
    (leftButton.firstChild as SVGSVGElement).setAttribute(
        "aria-hidden",
        `${!showLeftButton}`,
    );
}
