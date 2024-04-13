import "cypress-html-validate/commands";

afterEach(() => {
    cy.htmlvalidate();
});
