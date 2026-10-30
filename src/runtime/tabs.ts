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

    if (tabPanels.length === 0) {
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

    const tabNames = tabPanels.map((tabPanel) =>
        tabPanel.id.split("-").slice(1).join(" "),
    );
    const tabIds = tabPanels.map((tabPanel) => tabPanel.id);
    const tabButtonIds = tabPanels.map((tabPanel) => {
        const tabId = tabPanel.getAttribute("aria-labelledby");
        if (!tabId) {
            throw new Error("No aria-labelledby on tab");
        }
        return tabId;
    });

    for (const [i, tabName] of tabNames.entries()) {
        const tabButton = document.createElement("button");
        tabButton.setAttribute("role", "tab");
        tabButton.setAttribute("type", "button");
        tabButton.setAttribute("aria-selected", "false");
        tabButton.setAttribute("aria-controls", tabIds[i]);
        tabButton.classList.add("docs-tab");
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
        document.querySelectorAll<HTMLButtonElement>('.docs-tabs [role="tab"]'),
    );

    switch (event.key) {
        case "ArrowLeft":
            moveSelectedTab(-1);
            break;
        case "ArrowRight":
            moveSelectedTab(1);
            break;
        case "Home": {
            const tab = tabs.at(0);
            if (!tab) {
                return;
            }
            setSelectedTab(tab);
            break;
        }
        case "End": {
            const tab = tabs.at(-1);
            if (!tab) {
                return;
            }
            setSelectedTab(tab);
            break;
        }

        default:
            return;
    }

    event.preventDefault();
    event.stopPropagation();
};

function onClick(event: MouseEvent): void {
    setSelectedTab(event.target as HTMLButtonElement);
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

function getCurrentTab(): HTMLButtonElement | null {
    return document.querySelector<HTMLButtonElement>(
        '.docs-tabs [role="tab"][aria-selected="true"]',
    );
}

function moveSelectedTab(direction: -1 | 1): void {
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
    for (const tab of tabs) {
        tab.setAttribute("aria-selected", "false");
        tab.tabIndex = -1;
    }
    newTab.setAttribute("aria-selected", "true");
    newTab.removeAttribute("tabIndex");

    const tabPanels = document.querySelectorAll<HTMLElement>(".docs-tabpanel");
    for (const tabPanel of tabPanels) {
        tabPanel.classList.add("hidden-tabpanel");
    }

    const tabPanelId = newTab.getAttribute("aria-controls");
    if (!tabPanelId) {
        throw new Error("No aria-controls on tab panel");
    }
    const tabPanel = document.querySelector<HTMLElement>(
        `.docs-tabpanel[id="${tabPanelId}"]`,
    );
    tabPanel?.classList.remove("hidden-tabpanel");

    newTab.focus();
    scrollTabIntoView(newTab);
}
