describe("is-mobile menu and sidemeny", () => {
    beforeEach(() => {
        cy.setCookie("doc-hide-cookie-warning", "");
    });

    it("should show side menu width > 1024", () => {
        cy.viewport(1100, 720);
        cy.visit("/integration-tests/intermediate/foo/foo-1.html");
        cy.get("#topnav").should("not.be.visible");
        cy.get(".docs-mobile-nav").should("be.visible");
        cy.get("#sidenav").should("be.visible");
    });

    it("should not show side menu < 1024", () => {
        cy.viewport(1000, 720);
        cy.visit("/integration-tests/intermediate/foo/foo-1.html");
        cy.get("#topnav").should("not.be.visible");
        cy.get(".docs-mobile-nav").should("be.visible");
        cy.get("#sidenav").should("not.be.visible");
    });
});
