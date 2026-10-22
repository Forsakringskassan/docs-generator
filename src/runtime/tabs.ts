import { onContentReady } from "./on-content-ready";

onContentReady(() => {
    renderTabs();
});
window.addEventListener("docs:navigation", renderTabs);

function renderTabs(): void {
    const tabPanels = document.querySelectorAll<HTMLElement>(".docs-tab");

    if (tabPanels.length === 0) {
        return;
    }

    tabPanels[0].classList.remove("hidden-tab");

    const tabsContainer = document.createElement("div");
    tabsContainer.classList.add("docs-tabs");

    const tablistWrapper = document.createElement("div");
    tablistWrapper.classList.add("docs-tablist-wrapper");

    const tabList = document.createElement("div");
    tabList.setAttribute("role", "tablist");
    tabList.classList.add("docs-tablist");

    tabPanels[0].before(tabsContainer);

    tabsContainer.append(tablistWrapper);
    tablistWrapper.append(tabList);
    tabPanels.forEach((tabPanel) => {
        tabsContainer.append(tabPanel);
    });

    const tabNames: string[] = [];
    tabPanels.forEach((tabPanel) => {
        tabNames.push(tabPanel.id.split("-").slice(1).join(" "));
    });
    const tabIds: string[] = [];
    tabPanels.forEach((tabPanel) => {
        tabIds.push(tabPanel.id);
    });
    const tabButtonIds: string[] = [];
    tabPanels.forEach((tabPanel) => {
        const tabId = tabPanel.getAttribute("aria-labelledby");
        if (!tabId) {
            throw new Error("No aria-labelledby on tab");
        }
        tabButtonIds.push(tabId);
    });

    for (const [i, tabName] of tabNames.entries()) {
        const tabButton = document.createElement("button");
        tabButton.setAttribute("role", "tab");
        tabButton.setAttribute("type", "button");
        tabButton.setAttribute("aria-selected", "false");
        tabButton.setAttribute("aria-controls", tabIds[i]);
        tabButton.id = tabButtonIds[i];
        tabButton.textContent = tabName;
        tabButton.tabIndex = -1;

        tabList.append(tabButton);

        tabButton.addEventListener("click", onClick);
        tabButton.addEventListener("keydown", onKeydown);
    }

    const firstTabButton = tabList.firstChild as HTMLButtonElement;
    firstTabButton.removeAttribute("tabIndex");
    firstTabButton.setAttribute("aria-selected", "true");

    setupOverflow(tablistWrapper, tabList);
}

const onKeydown = (event: KeyboardEvent): void => {
    const tabs = Array.from(
        document.querySelectorAll<HTMLButtonElement>(':scope > [role="tab"]'),
    );

    let flag = false;

    switch (event.key) {
        case "ArrowLeft":
            moveSelectedTab(-1);
            flag = true;
            break;
        case "ArrowRight":
            moveSelectedTab(1);
            flag = true;
            break;
        case "Home":
            setSelectedTab(tabs.at(0) as HTMLButtonElement);
            flag = true;
            break;

        case "End":
            setSelectedTab(tabs.at(-1) as HTMLButtonElement);
            flag = true;
            break;

        default:
            return;
    }

    if (!flag) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
};

function onClick(event: MouseEvent): void {
    setSelectedTab(event.target as HTMLButtonElement);
}

function getCurrentTab(): HTMLButtonElement | null {
    return document.querySelector<HTMLButtonElement>(
        '.docs-tabs [role="tab"][aria-selected="true"]',
    );
}

function moveSelectedTab(direction: -1 | 1) {
    const currentTab = getCurrentTab();

    if (!currentTab) {
        return;
    }

    const siblingTab =
        direction === -1
            ? currentTab.previousElementSibling
            : currentTab.nextElementSibling;

    if (!siblingTab) {
        return;
    }

    setSelectedTab(siblingTab as HTMLButtonElement);
}

function setSelectedTab(newTab: HTMLButtonElement): void {
    const tabs = document.querySelectorAll<HTMLButtonElement>(
        '.docs-tabs [role="tab"]',
    );
    tabs.forEach((tab) => {
        tab.setAttribute("aria-selected", "false");
        tab.tabIndex = -1;
    });
    newTab.setAttribute("aria-selected", "true");
    newTab.removeAttribute("tabIndex");

    const tabPanels = document.querySelectorAll<HTMLElement>(".docs-tab");
    tabPanels.forEach((tabPanel) => {
        tabPanel.classList.add("hidden-tab");
    });

    const tabPanelId = newTab.getAttribute("aria-controls");
    if (!tabPanelId) {
        throw new Error("No aria-controls on tab panel");
    }
    const tabPanel = document.querySelector<HTMLElement>(
        `.docs-tab[id="${tabPanelId}"]`,
    );
    tabPanel?.classList.remove("hidden-tab");

    newTab.focus();
}

function setupOverflow(
    tablistWrapper: HTMLElement,
    tabList: HTMLElement,
): void {
    const rightButton = createOverflowArrowButton("right");
    rightButton.onclick = () => {
        const tab = findArrowToTab(tabList, "right");
        if (!tab) {
            return;
        }
        // Prescroll a bit to trigger buttons to dissapear for
        // caluclation to be correct when scrolling fully.
        tabList.scrollLeft += 1;
        updateOverflowButtonsVisibility();
        scrollToTab(tabList, tab, "right");
        updateOverflowButtonsVisibility();
    };

    tablistWrapper.append(rightButton);

    const leftButton = createOverflowArrowButton("left");
    leftButton.onclick = () => {
        const tab = findArrowToTab(tabList, "left");
        if (!tab) {
            return;
        }

        // Prescroll a bit to trigger buttons to dissapear for
        // caluclation to be correct when scrolling fully.
        tabList.scrollLeft -= 1;
        updateOverflowButtonsVisibility();
        scrollToTab(tabList, tab, "left");
        updateOverflowButtonsVisibility();
    };
    tablistWrapper.insertBefore(leftButton, tablistWrapper.firstChild);

    const updateOverflowButtonsVisibility = () => {
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
    };

    const resizeObserver = new ResizeObserver(updateOverflowButtonsVisibility);
    resizeObserver.observe(tabList);

    updateOverflowButtonsVisibility();
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
