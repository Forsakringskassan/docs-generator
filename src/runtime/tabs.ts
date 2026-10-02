import { onContentReady } from "./on-content-ready";

onContentReady(() => {
    const tabs = document.querySelectorAll<HTMLElement>(".docs-tab");

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
    }

    const firstTabButton = tabList.firstChild as HTMLButtonElement;
    firstTabButton.removeAttribute("tabIndex");
    firstTabButton.setAttribute("aria-selected", "true");
});
