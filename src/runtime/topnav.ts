import { debounce } from "./debounce";
import { onContentReady } from "./on-content-ready";

interface ItemPair {
    menu: HTMLElement;
    popover: HTMLElement;
}

interface Refs {
    header: HTMLElement;
    brand: HTMLElement;
    nav: HTMLElement;
    toolbar: HTMLElement;

    // nav: HTMLElement;
    // moreItem: HTMLElement;
    // moreButton: HTMLElement;
    // popoverContainer: HTMLElement;
    // popover: HTMLElement;
    itemPairs: ItemPair[];
    // highlightIndex: number;
}

function getElementsRefs(): Refs | undefined {
    const header = document.querySelector("header");
    if (!header) {
        return;
    }

    /* eslint-disable @typescript-eslint/no-non-null-assertion -- accept runtime error if not found */
    const brand = header.querySelector<HTMLElement>(".docs-header-brand")!;
    const nav = header.querySelector<HTMLElement>(".docs-header-nav")!;
    const toolbar = header.querySelector<HTMLElement>(".docs-header-toolbar")!;

    // const nav = document.querySelector<HTMLElement>("#topnav");
    // if (!nav) {
    //     return;
    // }

    // /* eslint-disable @typescript-eslint/no-non-null-assertion -- accept runtime error if not found */
    const menuItems = Array.from(
        nav.querySelectorAll<HTMLElement>(".docs-topnav__item"),
    );
    const moreItem = menuItems.pop()!;
    // const moreButton = moreItem.querySelector<HTMLElement>("button")!;
    const popoverContainer =
        moreItem.querySelector<HTMLElement>(".docs-contextmenu")!;
    const popover = popoverContainer.querySelector<HTMLElement>(
        ".docs-contextmenu__list",
    )!;
    const popoverItems = Array.from(
        popover.querySelectorAll<HTMLElement>(".docs-contextmenu__item"),
    );
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    // const highlightIndex = menuItems.findIndex((it) =>
    //     it.classList.contains("highlight"),
    // );
    const itemPairs = menuItems.map((menu, index) => ({
        menu,
        popover: popoverItems[index],
    }));

    // return {
    //     nav,
    //     moreItem,
    //     moreButton,
    //     popoverContainer,
    //     popover,
    //     itemPairs,
    //     highlightIndex,
    // };

    return {
        header,
        brand,
        nav,
        toolbar,
        itemPairs,
    };
}

// function setPopoverVisibility(visible: boolean, refs: Refs): void {
//     refs.popover.style.visibility = visible ? "visible" : "hidden";
//     refs.moreButton.ariaExpanded = visible.toString();
// }

// function togglePopover(event: Event, refs: Refs): void {
//     event.stopPropagation();
//     setPopoverVisibility(refs.popover.style.visibility === "hidden", refs);
// }

// function closePopoverOnEsc(event: KeyboardEvent, refs: Refs): void {
//     if (event.key === "Escape") {
//         setPopoverVisibility(false, refs);
//         refs.moreButton.focus();
//     }
// }

// function onClickPopover(event: Event): void {
//     event.stopPropagation();
// }

function hasOverflow(
    container: { offsetLeft: number; offsetWidth: number },
    content: { offsetLeft: number; offsetWidth: number },
): boolean {
    return (
        content.offsetLeft + content.offsetWidth >
        container.offsetLeft + container.offsetWidth
    );
}

// function setMenuItemVisibility(itemPair: ItemPair, visible: boolean): void {
//     itemPair.menu.style.visibility = visible ? "visible" : "hidden";
//     itemPair.popover.style.display = visible ? "none" : "block";
// }

function getChildWidth(element: HTMLElement): number {
    const cachedMaxWidth = element.style.maxWidth;

    if (cachedMaxWidth) {
        return parseFloat(cachedMaxWidth);
    }

    const width = Array.from(element.children).reduce((total, it) => {
        const style = getComputedStyle(it);
        const { width } = it.getBoundingClientRect();
        const marginLeft = parseFloat(style.marginLeft) || 0;
        const marginRight = parseFloat(style.marginRight) || 0;
        return total + Math.ceil(marginLeft + width + marginRight); // force rounding up to avoid sub-pixel issues
    }, 0);

    element.style.maxWidth = `${width}px`;
    return width;
}

function getUsableWidth(element: Element): number {
    const style = getComputedStyle(element);
    const width = element.getBoundingClientRect().width;
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    const contentWidth = width - paddingLeft - paddingRight;
    const gap = parseFloat(style.columnGap) || 0;
    return contentWidth - gap * 2;
}

function calculateVisibility(refs: Refs): void {
    const { header } = refs;

    /* this is expensive as *bleep* as it forces multiple reflows */

    header.style.setProperty("visibility", "hidden");
    header.classList.toggle("header--oneline", false);
    header.classList.toggle("header--multiline", false);

    const usableWidth = getUsableWidth(header);
    const brandWidth = getChildWidth(refs.brand);
    const navWidth = getChildWidth(refs.nav);
    const toolbarWidth = getChildWidth(refs.toolbar);
    const requiredWidth = brandWidth + navWidth + toolbarWidth;

    console.log({ usableWidth, requiredWidth });
    console.log({ brandWidth, navWidth, toolbarWidth });

    header.classList.toggle("header--oneline", requiredWidth < usableWidth);
    header.classList.toggle("header--multiline", requiredWidth >= usableWidth);
    header.style.removeProperty("visibility");

    //refs.moreItem.style.left = "0";
    const menuItems = refs.itemPairs.map((item) => item.menu);

    //const a = refs.nav.offsetLeft + refs.nav.offsetWidth;
    //const b = refs.nav.getBoundingClientRect().right;
    //console.log(refs.nav, a, b);

    const overflowIndex = menuItems.findIndex((it) =>
        hasOverflow(refs.nav, it),
    );
    //console.log("overflowIndex", overflowIndex);

    // if (overflowIndex === -1) {
    //     refs.itemPairs.forEach((it) => {
    //         setMenuItemVisibility(it, true);
    //     });
    //     refs.moreItem.style.visibility = "hidden";
    //     setPopoverVisibility(false, refs);
    //     return;
    // }

    // step back one position if more item don't fit at overflow index
    // if (
    //     hasOverflow(refs.nav, {
    //         offsetLeft: menuItems[overflowIndex].offsetLeft,
    //         offsetWidth: refs.moreItem.offsetWidth,
    //     })
    // ) {
    //     overflowIndex--;
    // }

    // refs.itemPairs.forEach((it, index) => {
    //     setMenuItemVisibility(it, index < overflowIndex);
    // });

    // refs.moreItem.classList.toggle(
    //     "highlight",
    //     refs.highlightIndex >= overflowIndex,
    // );
    // refs.moreItem.style.left = `${String(menuItems[overflowIndex].offsetLeft)}px`;
    // refs.moreItem.style.visibility = "visible";

    // const popupTop = refs.moreItem.offsetHeight + 16;
    // refs.popover.style.top = `${String(popupTop)}px`;
}

function setup(): Refs | undefined {
    const refs = getElementsRefs();
    if (!refs) {
        return;
    }

    // refs.moreItem.addEventListener("click", (e) => {
    //     togglePopover(e, refs);
    // });
    // refs.moreItem.addEventListener("keyup", (e) => {
    //     closePopoverOnEsc(e, refs);
    // });
    // refs.popoverContainer.addEventListener("click", onClickPopover);

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

    // window.addEventListener("docs:navigation", () => {
    //     const newRefs = setup();
    //     if (newRefs) {
    //         refs = newRefs;
    //     }
    //     calculateVisibility(refs);
    // });

    // document.addEventListener("click", () => {
    //     setPopoverVisibility(false, refs);
    // });

    //setPopoverVisibility(false, refs);
    calculateVisibility(refs);
});
