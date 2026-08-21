import { headerLayoutDetector } from "./header-layout-detector";
import { onContentReady } from "./on-content-ready";

interface Refs {
    nav: HTMLElement;
}

function getElementsRefs(): Refs | undefined {
    const nav = document.querySelector<HTMLElement>("#topnav");
    if (!nav) {
        return;
    }

    return {
        nav,
    };
}

function setup(): Refs | undefined {
    const refs = getElementsRefs();
    if (!refs) {
        return;
    }

    return refs;
}

onContentReady(() => {
    const newRefs = setup();
    if (!newRefs) {
        return;
    }

    headerLayoutDetector(newRefs.nav);
});
