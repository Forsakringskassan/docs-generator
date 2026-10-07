export function setupTabsOverflow(tabList: HTMLElement) {
    // More tabs buton
    const moreButton = document.createElement("button");
    moreButton.type = "button";
    moreButton.textContent = "Fler flikar";
    moreButton.classList.add("docs-tabs-more-button");
    moreButton.hidden = true;
    moreButton.setAttribute("popovertarget", "tabs-overflow-container");
    moreButton.tabIndex = -1;

    // Overflow list
    const overflowList = document.createElement("div");
    overflowList.classList.add("docs-tabs-overflow-container");
    overflowList.id = "tabs-overflow-container";
    overflowList.setAttribute("popover", "");

    const originalTabsOrder = Array.from(
        tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );

    tabList.appendChild(moreButton);
    tabList.appendChild(overflowList);

    const updateOverflow = () => {
        originalTabsOrder.forEach((tab) => {
            tabList.insertBefore(tab, moreButton);
        });

        moreButton.hidden = true;

        const tabs = Array.from(
            tabList.querySelectorAll<HTMLButtonElement>(
                ':scope > [role="tab"]',
            ),
        );

        const tabListWidth = tabList.clientWidth;

        const getTabsWidth = () =>
            Array.from(
                tabList.querySelectorAll<HTMLButtonElement>(
                    ':scope > [role="tab"]',
                ),
            ).reduce((total, tab) => total + tab.offsetWidth, 0);

        // All tabs fit in tablist
        if (getTabsWidth() <= tabListWidth) {
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
}
