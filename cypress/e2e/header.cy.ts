describe("Full screen", () => {
    it("Ensures the left and right columns stay on the same row (no wrap)", () => {
        cy.viewport(1725, 720);
        cy.setCookie("doc-hide-cookie-warning", "");
        cy.visit("/");

        cy.get(".docs-page-header__left").then(($left) => {
            cy.get(".docs-page-header__right").then(($right) => {
                const leftRect = $left[0].getBoundingClientRect();
                const rightRect = $right[0].getBoundingClientRect();

                expect(rightRect.top).to.be.lessThan(leftRect.bottom);

                expect(leftRect.top).to.be.lessThan(rightRect.bottom);
            });
        });

        cy.get(".docs-page-header")
            .should("have.css", "display", "flex")
            .and("have.css", "flex-wrap", "wrap");
    });
});
describe("tablet size", () => {
    it("Confirms that the header wraps into two rows at 1024x720", () => {
        cy.viewport(1024, 720);
        cy.setCookie("doc-hide-cookie-warning", "");
        cy.visit("/");
        cy.get(".docs-page-header__left").then(($left) => {
            cy.get(".docs-page-header__right").then(($right) => {
                const leftRect = $left[0].getBoundingClientRect();
                const rightRect = $right[0].getBoundingClientRect();

                expect(rightRect.top).to.be.greaterThan(leftRect.bottom - 2);
            });
        });
    });
});
describe("mobile size", () => {
    const mobileBreakPoint = 640;
    it("Mobile view - verify menu toggle and layout", () => {
        cy.viewport(mobileBreakPoint - 1, 720);
        cy.setCookie("doc-hide-cookie-warning", "");
        cy.visit("/");
        cy.get(".docs-page-header__right .docs-topnav").should(
            "not.be.visible",
        );

        cy.get(".docs-page-header__right .docs-mobile-nav").should(
            "be.visible",
        );

        cy.get(".docs-page-header__left").then(($left) => {
            cy.get(".docs-page-header__right").then(($right) => {
                const leftRect = $left[0].getBoundingClientRect();
                const rightRect = $right[0].getBoundingClientRect();

                expect(rightRect.top).to.be.greaterThan(leftRect.bottom - 2);
            });
        });
    });
});
