import { onContentReady } from "./on-content-ready";
import {
    isTabCutOffLeft,
    isTabCutOffRight,
    scrollOverflow,
    setupOverflow,
    updateOverflowButtonsVisibility,
} from "./tabs-overflow";

onContentReady(() => {
    renderTabs();
});
window.addEventListener("docs:navigation", renderTabs);

function renderTabs(): void {
    const tabPanels = Array.from(
        document.querySelectorAll<HTMLElement>(".docs-tabpanel"),
    );
    const tabs = Array.from(
        document.querySelectorAll<HTMLElement>(".docs-tab"),
    );

    if (tabPanels.length === 0 || tabPanels.length !== tabs.length) {
        return;
    }

    tabPanels[0].classList.remove("hidden-tabpanel");

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
    for (const tabPanel of tabPanels) {
        tabsContainer.append(tabPanel);
    }

    for (const tab of tabs) {
        tabList.append(tab);
        tab.addEventListener("click", (event) => {
            onClick(tabsContainer, event);
        });
        tab.addEventListener("keydown", (event) => {
            onKeydown(tabsContainer, event);
        });
    }

    const firstTab = tabList.firstChild as HTMLButtonElement;
    firstTab.removeAttribute("tabIndex");
    firstTab.setAttribute("aria-selected", "true");

    setupOverflow(tablistWrapper, tabList);
}

function onKeydown(tabsContainer: HTMLElement, event: KeyboardEvent): void {
    const tabs = getTabs(tabsContainer);

    switch (event.key) {
        case "ArrowLeft":
            moveSelectedTab(tabsContainer, -1);
            break;
        case "ArrowRight":
            moveSelectedTab(tabsContainer, 1);
            break;
        case "Home": {
            const tab = tabs.at(0);
            if (!tab) {
                return;
            }
            setSelectedTab(tabsContainer, tab);
            break;
        }
        case "End": {
            const tab = tabs.at(-1);
            if (!tab) {
                return;
            }
            setSelectedTab(tabsContainer, tab);
            break;
        }

        default:
            return;
    }

    event.preventDefault();
    event.stopPropagation();
}

function onClick(tabsContainer: HTMLElement, event: MouseEvent): void {
    setSelectedTab(tabsContainer, event.target as HTMLButtonElement);
}

function scrollTabIntoView(tab: Element): void {
    const tablist = tab.parentElement;

    if (!tablist) {
        return;
    }

    if (isTabCutOffLeft(tablist.getBoundingClientRect(), tab)) {
        scrollOverflow(tablist, tab, "left");
    } else if (isTabCutOffRight(tablist.getBoundingClientRect(), tab)) {
        scrollOverflow(tablist, tab, "right");
    } else {
        updateOverflowButtonsVisibility(tablist);
    }
}

function moveSelectedTab(tabsContainer: HTMLElement, direction: -1 | 1): void {
    const currentTab = getCurrentTab(tabsContainer);

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

    setSelectedTab(tabsContainer, siblingTab as HTMLButtonElement);
}

function setSelectedTab(
    tabsContainer: HTMLElement,
    newTab: HTMLButtonElement,
): void {
    const tabs = getTabs(tabsContainer);

    for (const tab of tabs) {
        tab.setAttribute("aria-selected", "false");
        tab.tabIndex = -1;
    }
    newTab.setAttribute("aria-selected", "true");
    newTab.removeAttribute("tabIndex");

    const tabPanels =
        tabsContainer.querySelectorAll<HTMLElement>(".docs-tabpanel");
    for (const tabPanel of tabPanels) {
        tabPanel.classList.add("hidden-tabpanel");
    }

    const tabPanelId = newTab.getAttribute("aria-controls");
    if (!tabPanelId) {
        throw new Error("No aria-controls on tab panel");
    }
    const tabPanel = tabsContainer.querySelector<HTMLElement>(
        `.docs-tabpanel[id="${tabPanelId}"]`,
    );
    tabPanel?.classList.remove("hidden-tabpanel");

    newTab.focus();
    scrollTabIntoView(newTab);
}

function getCurrentTab(tabsContainer: HTMLElement): HTMLButtonElement | null {
    return tabsContainer.querySelector<HTMLButtonElement>(
        '[role="tab"][aria-selected="true"]',
    );
}

function getTabs(tabsContainer: HTMLElement): HTMLButtonElement[] {
    return Array.from(
        tabsContainer.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
}
