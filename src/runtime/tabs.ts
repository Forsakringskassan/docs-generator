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

    const tabList = document.createElement("div");
    tabList.setAttribute("role", "tablist");
    tabList.classList.add("docs-tablist");

    tabPanels[0].before(tabsContainer);

    tabsContainer.append(tabList);
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

    setupOverflow(tabsContainer, tabList);
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

function setupOverflow(tabsContainer: HTMLElement, tabList: HTMLElement): void {
    // more tabs to right button
    const moreRightButton = document.createElement("button");
    moreRightButton.type = "button";
    moreRightButton.hidden = true;
    moreRightButton.classList.add(
        "docs-more-button",
        "docs-more-button--right",
    );
    moreRightButton.tabIndex = -1;
    moreRightButton.onclick = () => {
        scrollTabs(tabList, "right");
        updateOverflowButtons();
    };

    const moreRightIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
    );
    moreRightIcon.setAttribute("focusable", "false");
    moreRightIcon.classList.add("docs-more-icon", "docs-more-icon--right");
    moreRightIcon.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#docs-icon-arrow-down");
    moreRightIcon.append(use);
    moreRightButton.append(moreRightIcon);

    tabsContainer.append(moreRightButton);

    // more tabs to left button
    const moreLeftButton = document.createElement("button");
    moreLeftButton.type = "button";
    moreLeftButton.hidden = true;
    moreLeftButton.classList.add("docs-more-button", "docs-more-button--left");
    moreLeftButton.tabIndex = -1;
    moreLeftButton.onclick = () => {
        scrollTabs(tabList, "left");
        updateOverflowButtons();
    };

    const moreLeftIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
    );
    moreLeftIcon.setAttribute("focusable", "false");
    moreLeftIcon.classList.add("docs-more-icon", "docs-more-icon--left");
    moreLeftIcon.setAttribute("aria-hidden", "true");
    const useLeft = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use",
    );
    useLeft.setAttribute("href", "#docs-icon-arrow-down");
    moreLeftIcon.append(useLeft);
    moreLeftButton.append(moreLeftIcon);

    tabsContainer.append(moreLeftButton);

    const updateOverflowButtons = () => {
        const showRightButton =
            tabList.scrollWidth - tabList.clientWidth - tabList.scrollLeft > 1;
        moreRightButton.hidden = !showRightButton;
        moreRightIcon.setAttribute("aria-hidden", `${!showRightButton}`);
        const showLeftButton = tabList.scrollLeft > 1;
        moreLeftButton.hidden = !showLeftButton;
        moreLeftIcon.setAttribute("aria-hidden", `${!showLeftButton}`);
    };

    const resizeObserver = new ResizeObserver(updateOverflowButtons);
    resizeObserver.observe(tabList);

    updateOverflowButtons();
}

function scrollTabs(tabList: HTMLElement, direction: "left" | "right"): void {
    const tabs = Array.from(tabList.children);
    const tabListRect = tabList.getBoundingClientRect();

    if (direction === "right") {
        // Find first tab that is cut off to the right
        const nextTab = tabs.find((tab) => {
            return tab.getBoundingClientRect().right > tabListRect.right + 1;
        });

        if (nextTab) {
            // Scroll so that the hidden tab is visible
            tabList.scrollLeft +=
                nextTab.getBoundingClientRect().right - tabListRect.right;
        }
    } else {
        // Find first tab that is cut off to the left
        const prevTab = [...tabs].reverse().find((tab) => {
            return tab.getBoundingClientRect().left < tabListRect.left - 1;
        });

        if (prevTab) {
            // Scroll so that the hidden tab is visible
            tabList.scrollLeft -=
                tabListRect.left - prevTab.getBoundingClientRect().left;
        }
    }
}
