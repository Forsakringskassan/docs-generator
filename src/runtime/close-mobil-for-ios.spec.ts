// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initCloseMenuForIOS } from "./close-mobile-for-ios"; // Justera sökvägen till din fil

describe("initMobileNavFix", () => {
    let originalUserAgent: string;

    beforeEach(() => {
        // Spara undan ursprunglig userAgent så vi kan återställa den efter varje test
        originalUserAgent = window.navigator.userAgent;

        // Rensa DOM:en innan varje test körs
        document.body.replaceChildren();
    });

    afterEach(() => {
        // Återställ userAgent
        Object.defineProperty(window.navigator, "userAgent", {
            value: originalUserAgent,
            configurable: true,
        });
    });

    const setupMockDOM = (): void => {
        // Bygg upp en minimal struktur som liknar ditt Nunjucks-makro
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
        // 1. Simulera en iPhone User Agent
        expect.assertions(1);
        Object.defineProperty(window.navigator, "userAgent", {
            value: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
            configurable: true,
        });

        setupMockDOM();

        const parent =
            document.querySelector<HTMLDetailsElement>("#parentDetails")!;
        const child =
            document.querySelector<HTMLDetailsElement>("#childDetails")!;

        // Starta din fix
        initCloseMenuForIOS();

        // 2. Simulera att användaren stänger föräldra-menyn
        parent.open = false;

        // HTML5 toggle-eventet måste triggas manuellt i jsdom eftersom det inte sker automatiskt vid ändrat attribut i testmiljön
        parent.dispatchEvent(new Event("toggle"));

        // 3. Kontrollera att barnet också har stängts (removeAttribute("open"))
        expect(child.open).toBe(false);
    });

    it("should NOT close child details if the user agent is NOT iOS", () => {
        expect.assertions(1);
        // 1. Simulera en vanlig dator (Chrome på Windows t.ex.)
        Object.defineProperty(window.navigator, "userAgent", {
            value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            configurable: true,
        });

        setupMockDOM();

        const parent =
            document.querySelector<HTMLDetailsElement>("#parentDetails")!;
        const child =
            document.querySelector<HTMLDetailsElement>("#childDetails")!;

        initCloseMenuForIOS();

        // 2. Simulera att användaren stänger föräldra-menyn
        parent.open = false;
        parent.dispatchEvent(new Event("toggle"));

        // 3. Barnet ska fortfarande vara öppet på desktop
        expect(child.open).toBe(true);
    });
});
