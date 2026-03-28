import codePreviewStyle from "./code-preview.css";
import codePreviewTemplate from "./code-preview.html";

type CodePreviewVariant = "default" | "borderless";

export class CodePreviewElement extends HTMLElement {
    public constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    private hasDirectSlot(slotName: string): boolean {
        return this.querySelector(`:scope > [slot="${slotName}"]`) !== null;
    }

    private getVariant(): CodePreviewVariant {
        const variant = this.getAttribute("variant");
        if (variant === "borderless") {
            return "borderless";
        }
        return "default";
    }

    private toggleMarkup(button: HTMLElement): void {
        const controlsId = button.getAttribute("aria-controls");
        if (!controlsId || !this.shadowRoot) {
            return;
        }

        const controlledElement = this.shadowRoot.querySelector<HTMLElement>(
            `#${controlsId}`,
        );
        if (!controlledElement) {
            return;
        }

        const isExpanded = controlledElement.hidden;
        controlledElement.hidden = !controlledElement.hidden;
        button.setAttribute("aria-expanded", String(isExpanded));
    }

    public connectedCallback(): void {
        if (!this.shadowRoot) {
            return;
        }

        this.shadowRoot.replaceChildren();

        const variant = this.getVariant();
        if (this.getAttribute("variant") !== variant) {
            this.setAttribute("variant", variant);
        }

        const style = document.createElement("style");
        style.textContent = codePreviewStyle;
        this.shadowRoot.append(style);

        const content = document.createElement("div");
        content.innerHTML = codePreviewTemplate;

        /* eslint-disable @typescript-eslint/no-non-null-assertion -- template contains these elements */
        const preview = content.querySelector<HTMLElement>("#preview")!;
        const tabs = content.querySelector<HTMLElement>("#tabs")!;
        const controls = content.querySelector<HTMLElement>("#controls")!;
        const code = content.querySelector<HTMLElement>("#code")!;
        const toggleButton = content.querySelector<HTMLButtonElement>(
            ".code-preview__toggle-markup",
        )!;
        const fullscreenLink = content.querySelector<HTMLAnchorElement>(
            ".code-preview__fullscreen",
        )!;
        /* eslint-enable @typescript-eslint/no-non-null-assertion */

        const noPreview = this.hasAttribute("nopreview");

        if (this.hasDirectSlot("preview") && !noPreview) {
            preview.hidden = false;
        }

        const noMarkup = this.hasAttribute("nomarkup");
        const showToggleButton = !noMarkup && !noPreview;
        toggleButton.hidden = !showToggleButton;

        const fullscreenHref = this.getAttribute("fullscreen");
        const showFullscreenButton = Boolean(fullscreenHref) && !noPreview;
        if (fullscreenHref) {
            fullscreenLink.hidden = false;
            fullscreenLink.href = fullscreenHref;
        }
        if (noPreview) {
            fullscreenLink.hidden = true;
        }

        tabs.hidden = !showToggleButton && !showFullscreenButton;

        toggleButton.addEventListener("click", () => {
            this.toggleMarkup(toggleButton);
        });

        if (this.hasDirectSlot("controls") && !noPreview) {
            controls.hidden = false;
        }

        if (this.hasDirectSlot("code") && noPreview) {
            code.hidden = false;
        }

        this.shadowRoot.append(content);
    }
}
