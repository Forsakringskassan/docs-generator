describe("cookie-warning", () => {
    const selector = ".cookie-warning";
    const consentAllButton = "#consent-all-button";
    const consentFunctionalButton = "#consent-functional-button";

    it("should show cookie warning when no cookies", () => {
        cy.clearAllCookies();
        cy.visit("/processors");
        cy.get(selector).should("be.visible");
    });

    it("should not show cookie warning when cookies", () => {
        cy.clearAllCookies();
        cy.setCookie("doc-hide-cookie-warning", "");
        cy.visit("/processors");
        cy.get(selector).should("not.be.visible");
    });

    it("should hide warning, set 'doc-hide-cookie-warning', 'doc-cookie-consent' cookies and trigger event when clicking 'Consent all' button", (done) => {
        cy.clearAllCookies();
        cy.visit("/processors");

        cy.window().then((win) => {
            win.addEventListener("doc-cookie-consent", () => {
                done();
            });
        });

        cy.get(consentAllButton).click();
        cy.get(selector).should("not.be.visible");
        cy.getCookie("doc-hide-cookie-warning").should("exist");
        cy.getCookie("doc-cookie-consent").should("exist");
    });

    it("should hide warning, set 'doc-hide-cookie-warning' cookie when clicking 'Consent functional' button", () => {
        cy.clearAllCookies();
        cy.visit("/processors");
        cy.get(consentFunctionalButton).click();
        cy.get(selector).should("not.be.visible");
        cy.getCookie("doc-hide-cookie-warning").should("exist");
        cy.getCookie("doc-cookie-consent").should("not.exist");
    });
});
