import { toggleMarkup } from "./code-preview";
import "./mermaid";
import "./navigation";
import "./search";
import "./table-of-contents";
import "./version-banner";
import "./cookie";

declare global {
    interface Window {
        toggleMarkup(element: HTMLElement): void;
    }
}

window.toggleMarkup = toggleMarkup;