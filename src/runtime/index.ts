import { toggleMarkup } from "./code-preview";
import "./mermaid";
import "./navigation";
import "./search";
import "./table-of-contents";
import "./select-version";
import "./version-banner";

declare global {
    interface Window {
        toggleMarkup(element: HTMLElement): void;
    }
}

window.toggleMarkup = toggleMarkup;
