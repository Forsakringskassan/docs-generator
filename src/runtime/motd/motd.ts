import { type MOTDApi } from "./motd-api";
import { type MOTDMessage } from "./motd-message";

/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- let it explode at runtime, it is supposed to be present */
const container = document.querySelector<HTMLElement>("#motd-container")!;

/**
 * @internal
 */
export function showMessage(
    root: Pick<Document | HTMLElement, "querySelector">,
    container: HTMLElement,
    message: MOTDMessage,
): void {
    const { template: id = "motd-message" } = message;
    const selector = `template#${id}`;
    const template = root.querySelector<HTMLTemplateElement>(selector);
    if (!template) {
        throw new Error(`MOTD template element with id "${id}" not found!`);
    }
    const wrapper = template.content.cloneNode(true) as DocumentFragment;
    const bindings: Record<string, string | undefined> = {
        message: message.message,
        ...message.bindings,
    };
    for (const element of wrapper.querySelectorAll<HTMLElement>(
        "[data-bind]",
    )) {
        const key = element.dataset.bind!; // eslint-disable-line @typescript-eslint/no-non-null-assertion -- querySelector guarantees attribute will be present
        const value = bindings[key] ?? "";
        element.innerHTML = value;
        element.removeAttribute("data-bind");
    }
    if (message.preprocess) {
        message.preprocess(wrapper);
    }
    container.append(wrapper);
}

/**
 * @internal
 */
export const motd: MOTDApi = {
    enabled: true,
    showMessage: showMessage.bind(null, document, container),
};
