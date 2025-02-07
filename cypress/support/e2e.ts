import "cypress-html-validate/commands";
import "./text";

afterEach(() => {
    cy.htmlvalidate();
});
