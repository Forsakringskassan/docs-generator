beforeEach(() => {
    cy.visit("/live-example/example.html");
});

describe("html example", () => {
    const selector = '[data-test="html-example"]';
    const container = `${selector} .live-example__container`;
    const runtime = `${selector} .live-example__example`;
    const controls = `${selector} .live-example__controls`;
    const code = `${selector} .live-example__code`;
    const selection = `${selector} #html-name`;
    const toggleCode = `${code} button`;
    const markup = `${code} code`;
    const language = `.radio-button`;

    it("should contain all components", () => {
        cy.get(container).should("exist");
        cy.get(runtime).should("exist");
        cy.get(controls).should("exist");
        cy.get(code).should("exist");
    });

    it("should render correctly", () => {
        cy.get(runtime).should("exist");
        cy.get(runtime).should("contain.text", "Hello World!");
        cy.get(selection).select("Kalle Anka");
        cy.get(runtime).should("contain.text", "Hello Kalle Anka!");
    });

    it("should show markup correctly", () => {
        cy.get(code).should("exist");
        cy.get(toggleCode).click();
        cy.get(markup).should("contain.text", "<div>Hello World!</div>");
        cy.get(selection).select("Kalle Anka");
        cy.get(markup).should("contain.text", "<div>Hello Kalle Anka!</div>");
    });

    it("should only support rendering markup as html", () => {
        cy.get(code).should("exist");
        cy.get(toggleCode).click();
        cy.get(code).find(language).should("have.length", 1);
        cy.get(code).find(language).eq(0).should("contain.text", "HTML");
    });
});

describe("vue example", () => {
    const selector = '[data-test="vue-example"]';
    const container = `${selector} .live-example__container`;
    const runtime = `${selector} .live-example__example`;
    const name = `${runtime} input`;
    const controls = `${selector} .live-example__controls`;
    const code = `${selector} .live-example__code`;
    const selection = `${selector} #vue-name`;
    const toggleCode = `${code} button`;
    const markup = `${code} code`;
    const language = `.radio-button`;

    it("should contain all components", () => {
        cy.get(container).should("exist");
        cy.get(runtime).should("exist");
        cy.get(controls).should("exist");
        cy.get(code).should("exist");
    });

    it("should render correctly", () => {
        cy.get(runtime).should("exist");
        cy.get(runtime).should("contain.text", "Hello World!");
        cy.get(selection).select("custom");
        cy.get(name).clear();
        cy.get(name).type("Kajsa Anka");
        cy.get(runtime).should("contain.text", "Hello Kajsa Anka!");
    });

    it("should show markup correctly", () => {
        cy.get(code).should("exist");
        cy.get(toggleCode).click();
        cy.get(code).find(language).eq(0).click();
        cy.get(markup).should("contain.text", "<p>Hello {{ name }}!</p>");
        cy.get(code).find(language).eq(1).click();
        cy.get(markup).should("contain.text", "<p>Hello World!</p>");
    });

    it("should only support rendering markup as html", () => {
        cy.get(code).should("exist");
        cy.get(toggleCode).click();
        cy.get(code).find(language).should("have.length", 2);
        cy.get(code).find(language).eq(0).should("contain.text", "Vue");
        cy.get(code).find(language).eq(1).should("contain.text", "HTML");
    });
});
