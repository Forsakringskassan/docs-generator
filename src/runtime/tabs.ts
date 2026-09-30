import { onContentReady } from "./on-content-ready";

onContentReady(() => {
    console.log("hej");
    const tabs = document.querySelector<HTMLElement>(".docs-tabs");

    tabs?.classList.add("test");
});
