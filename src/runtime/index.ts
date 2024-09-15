import { toggleMarkup } from "./code-preview";
import "./mermaid";
import "./navigation";
import "./search";
import "./table-of-contents";
import "./version-banner";
import "./cookie";
import "./topnav";

export {
    type MOTDApi,
    type MOTDMessage,
    motdProxy as motd,
} from "./motd/motd-proxy";
export { onContentReady } from "./on-content-ready";

declare global {
    interface Window {
        toggleMarkup(element: HTMLElement): void;
    }
}

window.toggleMarkup = toggleMarkup;
