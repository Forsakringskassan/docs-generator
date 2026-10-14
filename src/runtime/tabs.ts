import { onContentReady } from "./on-content-ready";
import { setupTabsOverflow } from "./tabs-overflow";

onContentReady(() => renderTabs());
window.addEventListener("docs:navigation", renderTabs);

let allTabs: HTMLButtonElement[] = [];

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

    allTabs = Array.from(
        tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );

    const { moreButton, overflowList } = setupTabsOverflow(tabList);
    moreButton.addEventListener("keydown", onMoreButtonKeydown);

    overflowList.addEventListener("toggle", () => {
        if (overflowList.matches(":popover-open")) {
            const firstTab =
                overflowList.querySelector<HTMLButtonElement>('[role="tab"]');

            firstTab?.focus();
        }
    });
}

const onKeydown = (event: KeyboardEvent) => {
    const currentTab = event.currentTarget as HTMLButtonElement;
    const parent = currentTab.parentElement;

    if (!parent) {
        return;
    }

    const tabs = Array.from(
        parent.querySelectorAll<HTMLButtonElement>(':scope > [role="tab"]'),
    );

    const currentIndex = tabs.indexOf(currentTab);
    let nextTab: HTMLButtonElement | undefined;

    switch (event.key) {
        case "ArrowLeft":
            nextTab =
                currentIndex > 0
                    ? tabs[currentIndex - 1]
                    : parent.matches(":popover-open")
                      ? tabs[tabs.length - 1]
                      : undefined;
            break;

        case "ArrowRight":
            nextTab =
                currentIndex < tabs.length - 1
                    ? tabs[currentIndex + 1]
                    : parent.matches(":popover-open")
                      ? tabs[0]
                      : undefined;
            break;

        case "Home":
            nextTab = tabs[0];
            break;

        case "End":
            nextTab = tabs[tabs.length - 1];
            break;

        default:
            return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (nextTab) {
        setSelectedTab(nextTab);
    } else if (
        event.key === "ArrowRight" &&
        parent.classList.contains("docs-tablist")
    ) {
        const moreButton = parent.querySelector<HTMLButtonElement>(
            ".docs-tabs-more-button",
        );

        if (moreButton && !moreButton.hidden) {
            moreButton.focus();
        }
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

function moveSelectedTab(direction: -1 | 1) {
    const currentTab = getCurrentTab();

    if (!currentTab) {
        return;
    }

    const parent = currentTab.parentElement;

    if (!parent) {
        return;
    }

    const tabs = Array.from(
        parent.querySelectorAll<HTMLButtonElement>(':scope > [role="tab"]'),
    );

    const currentIndex = tabs.indexOf(currentTab);
    const nextTab = tabs[currentIndex + direction];

    if (nextTab) {
        setSelectedTab(nextTab);
        return;
    }

    const moreButton = parent.querySelector<HTMLButtonElement>(
        ".docs-tabs-more-button",
    );

    if (
        parent.classList.contains("docs-tablist") &&
        moreButton &&
        !moreButton.hidden
    ) {
        if (direction === 1) {
            moreButton.focus();
        }
    }
}

function onMoreButtonKeydown(event: KeyboardEvent) {
    if (event.key !== "ArrowLeft") {
        return;
    }

    const moreButton = event.currentTarget as HTMLButtonElement;
    const previousTab = moreButton.previousElementSibling;

    if (previousTab instanceof HTMLButtonElement) {
        event.preventDefault();
        previousTab.focus();
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
