interface Elements {
    root: Element;
    preview: HTMLElement;
    markup: HTMLPreElement;
    expand: HTMLElement;
}

function getElements(element: HTMLElement): Elements {
    /* eslint-disable @typescript-eslint/no-non-null-assertion -- code matches markup, rather have it crash if it doesn't */
    const root = element.closest(".code-preview")!;
    const preview = root.querySelector<HTMLElement>(".code-preview__preview")!;
    const markup = root.querySelector<HTMLPreElement>(".code-preview__markup")!;
    const expand = root.querySelector<HTMLElement>(".code-preview__expand")!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
    return {
        root,
        preview,
        markup,
        expand,
    };
}

export function toggleMarkup(button: HTMLElement): void {
    const { expand, markup } = getElements(button);
    const isOpen = !expand.classList.contains("animate-expand");

    expand.hidden = false;
    const rect = markup.getBoundingClientRect();

    if (isOpen) {
        button.setAttribute("aria-expanded", "false");
        expand.style.height = `${rect.height}px`;
        expand.classList.add("animate-expand");
        expand.classList.add("animate-expand--expanded");
        setTimeout(() => {
            expand.classList.remove("animate-expand--expanded");
            expand.style.height = "0px";
        }, 0);
        setTimeout(() => {
            expand.hidden = true;
        }, 500);
    } else {
        button.setAttribute("aria-expanded", "true");
        expand.style.height = `${rect.height}px`;
        expand.classList.add("animate-expand");
        expand.classList.add("animate-expand--expanded");
        setTimeout(() => {
            expand.classList.remove("animate-expand");
            expand.classList.remove("animate-expand--expanded");
            expand.style.height = "";
        }, 500);
    }
}
