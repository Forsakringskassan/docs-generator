import { onContentReady } from "./on-content-ready";

onContentReady(() => {
    console.log("hej");
    const tabs = document.querySelector<HTMLElement>(".docs-tabs");

    tabs?.classList.add("test");

    // Idé: Hämta ut alla tab content och kolla dess namn för att dynamiskt skapa upp tabs knappar
});
