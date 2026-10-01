import { describe, expect, it } from "vitest";
import { initCloseDetailMenu } from "./close-all-details";

describe("initMobileNavFix", () => {
    const setupMockDOM = (): void => {
        document.body.innerHTML = `
      <div class="docs-mobile-nav-wrapper">
        <ul class="docs-mobile-nav__list">
          <li>
            <details id="parentDetails" open>
              <summary>Förälder</summary>
              <ul class="docs-mobile-nav__list">
                <li>
                  <details id="childDetails" open>
                    <summary>Barn</summary>
                  </details>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    `;
    };

    it("should close child details when parent details is closed on iOS", () => {
        expect.assertions(1);

        setupMockDOM();

        const parent =
            document.querySelector<HTMLDetailsElement>("#parentDetails")!;
        const child =
            document.querySelector<HTMLDetailsElement>("#childDetails")!;

        initCloseDetailMenu();

        parent.open = false;

        parent.dispatchEvent(new Event("toggle"));

        expect(child.open).toBe(false);
    });
});
