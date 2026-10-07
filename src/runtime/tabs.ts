import { onContentReady } from "./on-content-ready";
import { setupTabsOverflow } from "./tabs-overflow";

onContentReady(() => renderTabs());
window.addEventListener("docs:navigation", renderTabs);

function renderTabs() {
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

    tabsContainer.appendChild(tabList);
    tabPanels.forEach((tabPanel) => tabsContainer.appendChild(tabPanel));

    const tabNames: string[] = [];
    tabPanels.forEach((tabPanel) =>
        tabNames.push(tabPanel.id.split("-").slice(1).join(" ")),
    );
    const tabIds: string[] = [];
    tabPanels.forEach((tabPanel) => tabIds.push(tabPanel.id));
    const tabButtonIds: string[] = [];
    tabPanels.forEach((tabPanel) =>
        tabButtonIds.push(tabPanel.getAttribute("aria-labelledby")!),
    );

    for (let i = 0; i < tabNames.length; i++) {
        const tabButton = document.createElement("button");
        tabButton.setAttribute("role", "tab");
        tabButton.setAttribute("type", "button");
        tabButton.setAttribute("aria-selected", "false");
        tabButton.setAttribute("aria-controls", tabIds[i]);
        tabButton.id = tabButtonIds[i];
        tabButton.textContent = tabNames[i];
        tabButton.tabIndex = -1;

        tabList.appendChild(tabButton);

        tabButton.addEventListener("click", onClick);
        tabButton.addEventListener("keydown", onKeydown);
    }

    const firstTabButton = tabList.firstChild as HTMLButtonElement;
    firstTabButton.removeAttribute("tabIndex");
    firstTabButton.setAttribute("aria-selected", "true");

    setupTabsOverflow(tabList);
}

const onKeydown = (event: KeyboardEvent) => {
    const tabs = document.querySelectorAll<HTMLElement>(
        '.docs-tabs [role="tab"]',
    );

    let flag = false;
    switch (event.key) {
        case "ArrowLeft":
            setSelectedTabToPrevious();
            flag = true;
            break;

        case "ArrowRight":
            setSelectedTabToNext();
            flag = true;
            break;

        case "Home":
            setSelectedTab(tabs[0] as HTMLButtonElement);
            flag = true;
            break;

        case "End":
            setSelectedTab(tabs[tabs.length - 1] as HTMLButtonElement);
            flag = true;
            break;

        default:
            break;
    }

    if (flag) {
        event.stopPropagation();
        event.preventDefault();
    }
};

function onClick(event: MouseEvent) {
    setSelectedTab(event.target as HTMLButtonElement);
}

function getCurrentTab(): HTMLButtonElement | null {
    return document.querySelector<HTMLButtonElement>(
        '.docs-tabs [role="tab"][aria-selected="true"]',
    );
}

function setSelectedTabToPrevious() {
    const currentTab = getCurrentTab();
    const previousTab = currentTab?.previousElementSibling;

    if (previousTab) {
        setSelectedTab(previousTab as HTMLButtonElement);
    }
}

function setSelectedTabToNext() {
    const currentTab = getCurrentTab();
    const nextTab = currentTab?.nextElementSibling;

    if (nextTab) {
        setSelectedTab(nextTab as HTMLButtonElement);
    }
}

function setSelectedTab(newTab: HTMLButtonElement) {
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
    tabPanels.forEach((tabPanel) => tabPanel.classList.add("hidden-tab"));

    const tabPanelId = newTab.getAttribute("aria-controls");
    const tabPanel = document.querySelector<HTMLElement>(
        `.docs-tab[id="${tabPanelId}"]`,
    );
    tabPanel?.classList.remove("hidden-tab");

    newTab.focus();
}
