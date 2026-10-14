export function setupTabsOverflow(tabList: HTMLElement): {
    moreButton: HTMLButtonElement;
    overflowList: HTMLDivElement;
} {
    // more-tabs button
    const moreButton = document.createElement("button");
    const moreButtonSpan = document.createElement("span");
    moreButton.type = "button";
    moreButton.classList.add("docs-tabs-more-button");
    moreButton.hidden = true;
    moreButton.setAttribute("popovertarget", "tabs-overflow-container");
    moreButton.tabIndex = -1;

    // arrow icon
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("focusable", "false");
    icon.classList.add("docs-icon");
    icon.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#docs-icon-arrow-down");
    icon.append(use);
    moreButtonSpan.append("Fler flikar", icon);
    moreButton.append(moreButtonSpan);

    // overflow list
    const overflowList = document.createElement("div");
    overflowList.classList.add("docs-tabs-overflow-container");
    overflowList.id = "tabs-overflow-container";
    overflowList.setAttribute("popover", "");

    const originalTabsOrder = Array.from(
        tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );

    tabList.append(moreButton);
    tabList.append(overflowList);

    const updateOverflow = (): void => {
        for (const tab of originalTabsOrder) {
            moreButton.before(tab);
        }

        moreButton.hidden = true;

        const tabListWidth = tabList.clientWidth;

        const getTabsWidth = (): number =>
            Array.from(
                tabList.querySelectorAll<HTMLButtonElement>(
                    ':scope > [role="tab"]',
                ),
            ).reduce((total, tab) => total + tab.offsetWidth, 0);

        if (getTabsWidth() <= tabListWidth) {
            overflowList.hidePopover();
            return;
        }

        moreButton.hidden = false;

        while (getTabsWidth() + moreButton.offsetWidth > tabListWidth) {
            const visibleTabs = Array.from(
                tabList.querySelectorAll<HTMLButtonElement>(
                    ':scope > [role="tab"]',
                ),
            );

            const lastTab = visibleTabs.at(-1);

            if (!lastTab) {
                break;
            }

            overflowList.prepend(lastTab);
        }
    };

    const resizeObserver = new ResizeObserver(updateOverflow);

    resizeObserver.observe(tabList);

    updateOverflow();

    return { moreButton, overflowList };
}
