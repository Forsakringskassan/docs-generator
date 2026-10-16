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
