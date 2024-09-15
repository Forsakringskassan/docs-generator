import { showMessage } from "./motd";

const defaultTemplate = /* HTML */ `
    <template id="motd-message">
        <p data-bind="message"></p>
    </template>
`;

function createRoot(template?: string): HTMLElement {
    const root = document.createElement("div");
    root.innerHTML = template ?? defaultTemplate;
    return root;
}

it("should add message element to container", () => {
    expect.assertions(2);
    const root = createRoot();
    const container = document.createElement("div");
    showMessage(root, container, {
        message: "lorem ipsum",
    });
    const messages = Array.from(container.querySelectorAll("p"));
    expect(messages).toHaveLength(1);
    expect(messages[0].textContent).toBe("lorem ipsum");
});

it("should add multiple messages", () => {
    expect.assertions(3);
    const root = createRoot();
    const container = document.createElement("div");
    showMessage(root, container, {
        message: "lorem ipsum",
    });
    showMessage(root, container, {
        message: "dolor sit amet",
    });
    const messages = Array.from(container.querySelectorAll("p"));
    expect(messages).toHaveLength(2);
    expect(messages[0].textContent).toBe("lorem ipsum");
    expect(messages[1].textContent).toBe("dolor sit amet");
});

it("should add message with html", () => {
    expect.assertions(3);
    const root = createRoot();
    const container = document.createElement("div");
    showMessage(root, container, {
        message: "lorem <em>ipsum</em>",
    });
    const messages = Array.from(container.querySelectorAll("p"));
    expect(messages).toHaveLength(1);
    expect(messages[0].textContent).toBe("lorem ipsum");
    expect(messages[0].querySelector("em")!.textContent).toBe("ipsum");
});

it("should support custom bindings", () => {
    expect.assertions(2);
    const root = createRoot(/* HTML */ `
        <template id="motd-message">
            <p data-bind="message"></p>
            <span data-bind="foobar"></span>
        </template>
    `);
    const container = document.createElement("div");
    showMessage(root, container, {
        message: "lorem ipsum",
        bindings: {
            foobar: "dolor sit amet",
        },
    });
    const p = container.querySelector("p")!;
    const span = container.querySelector("span")!;
    expect(p.textContent).toBe("lorem ipsum");
    expect(span.textContent).toBe("dolor sit amet");
});

it("should handle missing bindings", () => {
    expect.assertions(2);
    const root = createRoot(/* HTML */ `
        <template id="motd-message">
            <p data-bind="message"></p>
            <span data-bind="foobar"></span>
        </template>
    `);
    const container = document.createElement("div");
    showMessage(root, container, {
        message: "lorem ipsum",
    });
    const p = container.querySelector("p")!;
    const span = container.querySelector("span")!;
    expect(p.textContent).toBe("lorem ipsum");
    expect(span.textContent).toBe("");
});

it("should support preprocessing", () => {
    expect.assertions(2);
    const root = createRoot();
    const container = document.createElement("div");
    showMessage(root, container, {
        message: "lorem ipsum",
        preprocess(element) {
            const p = element.querySelector("p")!;
            p.textContent = "dolor sit amet";
        },
    });
    const messages = Array.from(container.querySelectorAll("p"));
    expect(messages).toHaveLength(1);
    expect(messages[0].textContent).toBe("dolor sit amet");
});

it("should support custom template", () => {
    expect.assertions(1);
    const root = createRoot(/* HTML */ `
        <template id="motd-message">
            <p>default</p>
        </template>
        <template id="custom">
            <p>custom</p>
        </template>
    `);
    const container = document.createElement("div");
    showMessage(root, container, {
        message: "lorem ipsum",
        template: "custom",
    });
    const p = container.querySelector("p")!;
    expect(p.textContent).toBe("custom");
});

it("should throw error template element does not exist", () => {
    expect.assertions(1);
    const root = createRoot("");
    const container = document.createElement("div");
    expect(() => {
        showMessage(root, container, {
            message: "lorem ipsum",
            template: "custom",
        });
    }).toThrow(`MOTD template element with id "custom" not found!`);
});
