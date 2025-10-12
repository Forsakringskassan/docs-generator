import { debounce } from "./debounce";
import { onContentReady } from "./on-content-ready";

interface ItemPair {
    menu: HTMLElement;
    popover: HTMLElement;
}

interface Refs {
    nav: HTMLElement;
    moreItem: HTMLElement;
    moreButton: HTMLElement;
    popoverContainer: HTMLElement;
    popover: HTMLElement;
    itemPairs: ItemPair[];
    highlightIndex: number;
}

function getElementsRefs(): Refs | undefined {
    const nav = document.querySelector<HTMLElement>("#topnav");
    if (!nav) {
        return;
    }

    /* eslint-disable @typescript-eslint/no-non-null-assertion -- accept runtime error if not found */
    const menuItems = Array.from(
        nav.querySelectorAll<HTMLElement>(".docs-topnav__item"),
    );
    const moreItem = menuItems.pop()!;
    const moreButton = moreItem.querySelector<HTMLElement>("button")!;
    const popoverContainer =
        moreItem.querySelector<HTMLElement>(".docs-contextmenu")!;
    const popover = popoverContainer.querySelector<HTMLElement>(
        ".docs-contextmenu__list",
    )!;
    const popoverItems = Array.from(
        popover.querySelectorAll<HTMLElement>(".docs-contextmenu__item"),
    );
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    const highlightIndex = menuItems.findIndex((it) =>
        it.classList.contains("highlight"),
    );
    const itemPairs = menuItems.map((menu, index) => ({
        menu,
        popover: popoverItems[index],
    }));

    return {
        nav,
        moreItem,
        moreButton,
        popoverContainer,
        popover,
        itemPairs,
        highlightIndex,
    };
}

function setPopoverVisibility(visible: boolean, refs: Refs): void {
    refs.popover.style.visibility = visible ? "visible" : "hidden";
    refs.moreButton.ariaExpanded = visible.toString();
}

function togglePopover(event: Event, refs: Refs): void {
    event.stopPropagation();
    setPopoverVisibility(refs.popover.style.visibility === "hidden", refs);
}

function closePopoverOnEsc(event: KeyboardEvent, refs: Refs): void {
    if (event.key === "Escape") {
        setPopoverVisibility(false, refs);
        refs.moreButton.focus();
    }
}

function onClickPopover(event: Event): void {
    event.stopPropagation();
}

function hasOverflow(
    container: { offsetLeft: number; offsetWidth: number },
    content: { offsetLeft: number; offsetWidth: number },
): boolean {
    return (
        content.offsetLeft + content.offsetWidth >
        container.offsetLeft + container.offsetWidth
    );
}

function setMenuItemVisibility(itemPair: ItemPair, visible: boolean): void {
    itemPair.menu.style.visibility = visible ? "visible" : "hidden";
    itemPair.popover.style.display = visible ? "none" : "block";
}

function calculateVisibility(refs: Refs): void {
    refs.moreItem.style.left = "0";
    const menuItems = refs.itemPairs.map((item) => item.menu);
    let overflowIndex = menuItems.findIndex((it) => hasOverflow(refs.nav, it));

    if (overflowIndex === -1) {
        refs.itemPairs.forEach((it) => {
            setMenuItemVisibility(it, true);
        });
        refs.moreItem.style.visibility = "hidden";
        setPopoverVisibility(false, refs);
        return;
    }

    // step back one position if more item don't fit at overflow index
    if (
        hasOverflow(refs.nav, {
            offsetLeft: menuItems[overflowIndex].offsetLeft,
            offsetWidth: refs.moreItem.offsetWidth,
        })
    ) {
        overflowIndex--;
    }

    refs.itemPairs.forEach((it, index) => {
        setMenuItemVisibility(it, index < overflowIndex);
    });

    refs.moreItem.classList.toggle(
        "highlight",
        refs.highlightIndex >= overflowIndex,
    );
    refs.moreItem.style.left = `${String(menuItems[overflowIndex].offsetLeft)}px`;
    refs.moreItem.style.visibility = "visible";

    const popupTop = refs.moreItem.offsetHeight + 16;
    refs.popover.style.top = `${String(popupTop)}px`;
}

function setup(): Refs | undefined {
    const refs = getElementsRefs();
    if (!refs) {
        return;
    }

    refs.moreItem.addEventListener("click", (e) => {
        togglePopover(e, refs);
    });
    refs.moreItem.addEventListener("keyup", (e) => {
        closePopoverOnEsc(e, refs);
    });
    refs.popoverContainer.addEventListener("click", onClickPopover);

    return refs;
}

onContentReady(() => {
    const newRefs = setup();
    if (!newRefs) {
        return;
    }

    let refs = newRefs;

    window.addEventListener(
        "resize",
        debounce(() => {
            calculateVisibility(refs);
        }, 100),
    );

    window.addEventListener("docs:navigation", () => {
        const newRefs = setup();
        if (newRefs) {
            refs = newRefs;
        }
        calculateVisibility(refs);
    });

    document.addEventListener("click", () => {
        setPopoverVisibility(false, refs);
    });

    setPopoverVisibility(false, refs);
    calculateVisibility(refs);
});
