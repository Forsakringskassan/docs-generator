import { onContentReady } from "./on-content-ready";

onContentReady(() => {
    const tabs = document.querySelectorAll<HTMLElement>(".docs-tab");

    if (tabs.length === 0) {
        return;
    }

    tabs[0].classList.remove("hidden-tab");

    const tabsContainer = document.createElement("div");
    tabsContainer.classList.add("docs-tabs");

    const tabList = document.createElement("div");
    tabList.setAttribute("role", "tablist");

    tabs[0].before(tabsContainer);

    tabsContainer.appendChild(tabList);
    tabs.forEach((tab) => tabsContainer.appendChild(tab));

    const tabNames: string[] = [];
    tabs.forEach((tab) => tabNames.push(tab.id.split("-").slice(1).join(" ")));
    const tabIds: string[] = [];
    tabs.forEach((tab) => tabIds.push(tab.id));
    const tabButtonIds: string[] = [];
    tabs.forEach((tab) =>
        tabButtonIds.push(tab.getAttribute("aria-labelledby")!),
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

        tabButton.addEventListener("click", switchTab);
    }

    const firstTabButton = tabList.firstChild as HTMLButtonElement;
    firstTabButton.removeAttribute("tabIndex");
    firstTabButton.setAttribute("aria-selected", "true");
});

const switchTab = (event: MouseEvent) => {
    const button = event.target as HTMLElement;
    const tabPanelId = button.getAttribute("aria-controls");

    const tabs = document.querySelectorAll<HTMLElement>(".docs-tab");

    tabs.forEach((tab) => tab.classList.add("hidden-tab"));

    const tabPanel = document.querySelector<HTMLElement>(
        `.docs-tab[id="${tabPanelId}"]`,
    );
    tabPanel?.classList.remove("hidden-tab");
};
