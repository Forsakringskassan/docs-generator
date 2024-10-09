import { toggleMarkup } from "./code-preview";

jest.useFakeTimers();

describe("toggleMarkup()", () => {
    it("should expand markup", () => {
        expect.assertions(3);
        const element = document.createElement("div");
        element.innerHTML = /* HTML */ `
            <div class="code-preview">
                <button type="button"></button>
                <div class="code-preview__expand animate-expand">
                    <pre class="code-preview__markup"></pre>
                </div>
            </div>
        `;
        const button = element.querySelector("button")!;
        const expand = element.querySelector(".code-preview__expand")!;
        toggleMarkup(button);
        jest.runAllTimers();
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(expand.hasAttribute("hidden")).toBeFalsy();
        expect(expand.classList).not.toContain("animate-expand");
    });

    it("should collapse markup", () => {
        expect.assertions(3);
        const element = document.createElement("div");
        element.innerHTML = /* HTML */ `
            <div class="code-preview">
                <button type="button"></button>
                <div class="code-preview__expand">
                    <pre class="code-preview__markup"></pre>
                </div>
            </div>
        `;
        const button = element.querySelector("button")!;
        const expand = element.querySelector(".code-preview__expand")!;
        toggleMarkup(button);
        jest.runAllTimers();
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(expand.hasAttribute("hidden")).toBeTruthy();
        expect(expand.classList).toContain("animate-expand");
    });
});
