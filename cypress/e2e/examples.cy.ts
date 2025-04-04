beforeEach(() => {
    cy.session("cookie-warning", () => {
        cy.visit("/");
        cy.setCookie("doc-hide-cookie-warning", "");
    });

    cy.visit("/e2e/examples.html");
});

describe("examples", () => {
    it("multiple inline examples should render and run", () => {
        const selector1 = "[data-test=inline-1]";
        const selector2 = "[data-test=inline-2]";
        const selector3 = "[data-test=inline-3]";
        cy.get(selector1).should("contain.text", "foo");
        cy.get(selector2).should("contain.text", "foo");
        cy.get(selector3).should("contain.text", "bar");
    });

    it("multiple imported examples should render and run", () => {
        const selector1 = "[data-test=imported-1]";
        const selector2 = "[data-test=imported-2]";
        const selector3 = "[data-test=imported-3]";
        cy.get(selector1).should("contain.text", "foo");
        cy.get(selector2).should("contain.text", "foo");
        cy.get(selector3).should("contain.text", "bar");
    });
});
