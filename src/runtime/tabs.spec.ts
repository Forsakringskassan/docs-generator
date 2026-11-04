import { afterEach, beforeEach, expect, it, vi } from "vitest";
import "./tabs";

const panels = /* HTML */ `
    <div
        id="tabpanel-first-tab"
        class="docs-tabpanel hidden-tabpanel"
        role="tabpanel"
        aria-labelledby="tab-first-tab"
    >
        First panel
    </div>
    <div
        id="tabpanel-second-tab"
        class="docs-tabpanel hidden-tabpanel"
        role="tabpanel"
        aria-labelledby="tab-second-tab"
    >
        Second panel
    </div>
    <div
        id="tabpanel-third-tab"
        class="docs-tabpanel hidden-tabpanel"
        role="tabpanel"
        aria-labelledby="tab-third-tab"
    >
        Third panel
    </div>
`;

beforeEach(() => {
    document.body.innerHTML = panels;
    vi.stubGlobal(
        "ResizeObserver",
        class {
            public observe = vi.fn();
        },
    );
    window.dispatchEvent(new Event("docs:navigation"));
});

afterEach(() => {
    vi.unstubAllGlobals();
});

it("1.2, 1.5 - clicking a tab selects it and shows its panel", () => {
    expect.assertions(3);
    const tabs = document.querySelectorAll<HTMLButtonElement>(
        '.docs-tabs [role="tab"]',
    );
    const tabPanels = document.querySelectorAll<HTMLElement>(".docs-tabpanel");

    tabs[1].click();

    expect(tabs[0].getAttribute("aria-selected")).toBe("false");
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(tabPanels[1].classList).not.toContain("hidden-tabpanel");
});

it("1.3 - ArrowRight activates the next tab", () => {
    expect.assertions(3);
    const tabs = document.querySelectorAll<HTMLButtonElement>(
        '.docs-tabs [role="tab"]',
    );

    tabs[0].focus();
    tabs[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );

    expect(tabs[0].getAttribute("aria-selected")).toBe("false");
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(tabs[1]);
});

it("1.3 - ArrowRight does not move past the last tab", () => {
    expect.assertions(2);
    const tabs = document.querySelectorAll<HTMLButtonElement>(
        '.docs-tabs [role="tab"]',
    );

    tabs[2].click();
    tabs[2].focus();
    tabs[2].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );

    expect(tabs[2].getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(tabs[2]);
});

it("1.3 - ArrowLeft does not move before the first tab", () => {
    expect.assertions(2);
    const tabs = document.querySelectorAll<HTMLButtonElement>(
        '.docs-tabs [role="tab"]',
    );

    tabs[0].focus();
    tabs[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
    );

    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(tabs[0]);
});

it("1.3, 1.5 - ArrowLeft activates the previous tab and shows its panel", () => {
    expect.assertions(2);
    const tabs = document.querySelectorAll<HTMLButtonElement>(
        '.docs-tabs [role="tab"]',
    );
    const tabPanels = document.querySelectorAll<HTMLElement>(".docs-tabpanel");

    tabs[1].focus();
    tabs[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
    );

    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabPanels[0].classList).not.toContain("hidden-tabpanel");
});
