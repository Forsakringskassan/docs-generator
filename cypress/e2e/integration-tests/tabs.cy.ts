beforeEach(() => {
    cy.visit("/integration-tests/tabs/cats/");
});

describe("tabs", () => {
    it("1.1 - should render a tablist and tab panels", () => {
        cy.get('.docs-tabs [role="tab"]').should("have.length.at.least", 1);
        cy.get('.docs-tabpanel[role="tabpanel"]').should(
            "have.length.at.least",
            1,
        );
    });

    it("1.4 - shows the overflow button for tabs outside the row", () => {
        cy.viewport(400, 720);

        const rightButton = ".docs-tabs-more-button--right";
        const leftButton = ".docs-tabs-more-button--left";

        cy.get(rightButton).should("be.visible");
        cy.get(leftButton).should("not.be.visible");

        cy.get(rightButton).click();

        cy.get(leftButton).should("be.visible");
    });

    it("1.4 - right overflow button scrolls the next tab into view", () => {
        cy.viewport(400, 720);

        const tablist = ".docs-tablist";
        const rightButton = ".docs-tabs-more-button--right";
        cy.get(rightButton).should("be.visible");

        cy.get(tablist).then(($tablist) => {
            const tablistElement = $tablist[0];
            const initialRect = tablistElement.getBoundingClientRect();

            const nextTabs = Array.from(tablistElement.children).filter(
                (tab) =>
                    tab.getBoundingClientRect().right > initialRect.right + 1,
            );

            const nextTab = nextTabs[0];

            if (!nextTab) {
                throw new Error("Expected a tab outside the visible row");
            }

            cy.get(rightButton).click();

            cy.get(`[id="${nextTab.id}"]`).should(($tab) => {
                const tabRect = $tab[0].getBoundingClientRect();

                const tablistElement = Cypress.$(tablist)[0];
                const tablistRect = tablistElement.getBoundingClientRect();

                expect(tabRect.right).to.be.at.most(tablistRect.right + 1);
            });
        });
    });

    it("1.4 - left overflow button scrolls the previous tab into view", () => {
        cy.viewport(400, 720);

        const tablist = ".docs-tablist";
        const rightButton = ".docs-tabs-more-button--right";
        const leftButton = ".docs-tabs-more-button--left";

        cy.get(rightButton).click();

        cy.get(tablist).then(($tablist) => {
            const tablistElement = $tablist[0];
            const initialRect = tablistElement.getBoundingClientRect();

            const previousTabs = Array.from(tablistElement.children).filter(
                (tab) =>
                    tab.getBoundingClientRect().left < initialRect.left - 1,
            );

            const previousTab = previousTabs[previousTabs.length - 1];

            if (!previousTab) {
                throw new Error("Expected a tab outside the visible row");
            }

            cy.get(leftButton).click();

            cy.get(`[id="${previousTab.id}"]`).should(($tab) => {
                const tabRect = $tab[0].getBoundingClientRect();
                const tablistRect = tablistElement.getBoundingClientRect();

                expect(tabRect.left).to.be.at.least(tablistRect.left - 1);
            });
        });
    });

    it("1.5 - clicking the overflow buttons does not change the active tab", () => {
        cy.viewport(400, 720);

        const tabs = '.docs-tabs [role="tab"]';
        const rightButton = ".docs-tabs-more-button--right";
        const leftButton = ".docs-tabs-more-button--left";

        cy.get(tabs)
            .filter('[aria-selected="true"]')
            .should("have.length", 1)
            .and("have.text", "Cat breeds");

        cy.get(rightButton).click();

        cy.get(tabs)
            .filter('[aria-selected="true"]')
            .should("have.length", 1)
            .and("have.text", "Cat breeds");

        cy.get(tabs).contains("Cat colors").click();

        cy.get(tabs)
            .filter('[aria-selected="true"]')
            .should("have.length", 1)
            .and("have.text", "Cat colors");

        cy.get(leftButton).click();

        cy.get(tabs)
            .filter('[aria-selected="true"]')
            .should("have.length", 1)
            .and("have.text", "Cat colors");
    });

    it("1.7 - clicking between tabs does not reload the page", () => {
        const tabs = '.docs-tabs [role="tab"]';
        const pageLoad = cy.stub();
        cy.on("window:before:load", pageLoad);

        cy.get(tabs).eq(1).click();

        cy.get(tabs).eq(1).should("have.attr", "aria-selected", "true");
        cy.then(() => {
            expect(pageLoad.callCount).to.equal(0);
        });
    });

    it("1.7 - navigating between tabs with arrow keys does not reload the page", () => {
        const tabs = '.docs-tabs [role="tab"]';
        const pageLoad = cy.stub();
        cy.on("window:before:load", pageLoad);

        cy.get(tabs).first().focus();
        cy.get(tabs).first().type("{rightArrow}");

        cy.get(tabs).eq(1).should("have.attr", "aria-selected", "true");
        cy.then(() => {
            expect(pageLoad.callCount).to.equal(0);
        });
    });

    it("1.8 - browser back navigates to the previous page after changing tabs", () => {
        cy.visit("/integration-tests/tabs/index.html");
        cy.visit("/integration-tests/tabs/cats/");

        cy.get('.docs-tabs [role="tab"]').eq(1).click();

        cy.go("back");

        cy.location("pathname").should(
            "eq",
            "/integration-tests/tabs/index.html",
        );
    });

    it("2.2 - opens the tab containing a heading from its URL fragment", () => {
        cy.visit("/integration-tests/tabs/cats/#common_cat_colors");

        cy.location("hash").should("eq", "#common_cat_colors");
        cy.get('.docs-tabs [role="tab"][aria-selected="true"]')
            .should("have.length", 1)
            .and("have.text", "Cat colors");
        cy.get("#common_cat_colors").should("be.visible");
    });
});
