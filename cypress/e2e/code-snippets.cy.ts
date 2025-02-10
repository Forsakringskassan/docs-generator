beforeEach(() => {
    cy.session("cookie-warning", () => {
        cy.visit("/");
        cy.setCookie("doc-hide-cookie-warning", "");
    });

    cy.visit("/e2e/code-snippets.html");
});

describe("code snippets", () => {
    it("inline typescript should handle snippets", () => {
        const selector = "[data-test=ts-inline]";
        const markup = `${selector} code`;
        cy.get(markup).should("exist");
        cy.get(markup).text().should("equal", `foo("bar");`);
    });

    it("imported typescript should handle snippets", () => {
        const selector = "[data-test=ts-import]";
        const markup = `${selector} code`;
        cy.get(markup).should("exist");
        cy.get(markup).text().should("equal", `foo("bar");`);
    });

    it("inline vue should handle snippets", () => {
        const selector = "[data-test=vue-inline]";
        const runtime = `${selector} .code-preview__preview`;
        const markup = `${selector} .code-preview__markup code`;
        cy.get(runtime).should("exist");
        cy.get(runtime).text().should("equal", "Hello World!");
        cy.get(markup).should("exist");
        cy.get(markup).text().should("equal", `<p>Hello {{ name }}!</p>`);
    });

    it("imported vue should handle snippets", () => {
        const selector = "[data-test=vue-import]";
        const runtime = `${selector} .code-preview__preview`;
        const markup = `${selector} .code-preview__markup code`;
        cy.get(runtime).should("exist");
        cy.get(runtime).text().should("equal", "Hello World!");
        cy.get(markup).should("exist");
        cy.get(markup).text().should("equal", `<p>Hello {{ name }}!</p>`);
    });
});
