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

        //hen on a single row, 'is-single-row' forces the top menu to the right side, aligning it next to the search function.
        cy.get(".docs-page-header")
            .should("have.class", "is-single-row")
            .and("not.have.class", "is-multi-row");
    });
});
describe("tablet size", () => {
    it("Confirms that the header wraps into two rows at 1024x720", () => {
        //At 1024px, the top menu exceeds one row and requires flex-wrap to break into two rows.
        cy.viewport(1024, 720);
        cy.setCookie("doc-hide-cookie-warning", "");
        cy.visit("/");
        cy.get(".docs-page-header__left").then(($left) => {
            cy.get(".docs-page-header__right").then(($right) => {
                const leftRect = $left[0].getBoundingClientRect();
                const rightRect = $right[0].getBoundingClientRect();
                //Subtract -2 for safety margin to prevent test failure from minor browser rounding errors.
                expect(rightRect.top).to.be.greaterThan(leftRect.bottom - 2);
            });
        });
        //If the top menu wraps, the 'is-multi-row' class triggers and shifts the top menu alignment to the left.
        cy.get(".docs-page-header")
            .should("have.class", "is-multi-row")
            .and("not.have.class", "is-single-row");
    });
});
describe("mobile size", () => {
    it("Mobile view - verify menu toggle and layout", () => {
        //Viewports below 640px (e.g., 639px) fall under the small breakpoint and adopt the mobile header appearance.
        cy.viewport(639, 720);
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
