declare global {
    /* eslint-disable-next-line @typescript-eslint/no-namespace -- module augmentation */
    namespace Cypress {
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars -- to match Cypress */
        interface Chainable<Subject> {
            text(): Chainable<string | string[]>;
        }
    }
}

function isTextNode(node: ChildNode): node is Text {
    return node.nodeType === Node.TEXT_NODE;
}

function isHTMLElementNode(node: ChildNode): node is HTMLElement {
    return node.nodeType === Node.ELEMENT_NODE;
}

function getTextContent(element: HTMLElement): string {
    return Array.from(element.childNodes, (child) => {
        if (isTextNode(child)) {
            return child.data;
        } else if (isHTMLElementNode(child)) {
            return getTextContent(child);
        }
    }).join("");
}

function resolveText(subject: Cypress.JQueryWithSelector): string | string[] {
    const text = subject.map((_, elem) => {
        return getTextContent(elem).trim().replace(/\s+/g, " ");
    });
    return text.length === 1 ? text[0] : text.toArray();
}

Cypress.Commands.addQuery("text", () => {
    return (subject) => resolveText(subject);
});

export {};
