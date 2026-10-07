export function setupTabsOverflow(tabList: HTMLElement) {
    const moreButton = document.createElement("button");

    moreButton.type = "button";
    moreButton.textContent = "Fler flikar";
    moreButton.classList.add("docs-tabs-more");
    moreButton.hidden = true;

    const overflowList = document.createElement("div");

    overflowList.classList.add("docs-tabs-overflow");
    overflowList.hidden = true;

    console.log(tabList);
    tabList.appendChild(moreButton);
    tabList.appendChild(overflowList);

    moreButton.addEventListener("click", () => {
        overflowList.hidden = !overflowList.hidden;
    });

    const updateOverflow = () => {
        // Flytta tillbaka alla tabs från overflow
        const overflowTabs = Array.from(
            overflowList.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
        );

        overflowTabs.reverse().forEach((tab) => {
            tabList.insertBefore(tab, moreButton);
        });

        moreButton.hidden = true;
        overflowList.hidden = true;

        const tabs = Array.from(
            tabList.querySelectorAll<HTMLButtonElement>(
                ':scope > [role="tab"]',
            ),
        );

        const tabListWidth = tabList.clientWidth;

        // Räkna ut den totala bredden på alla tabs
        const getTabsWidth = () =>
            Array.from(
                tabList.querySelectorAll<HTMLButtonElement>(
                    ':scope > [role="tab"]',
                ),
            ).reduce((total, tab) => total + tab.offsetWidth, 0);

        // Alla får plats utan More
        if (getTabsWidth() <= tabListWidth) {
            return;
        }

        // Vi behöver More
        moreButton.hidden = false;

        // Flytta sista tabben tills tabs + More får plats
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
