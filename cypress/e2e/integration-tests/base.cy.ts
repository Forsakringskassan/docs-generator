beforeEach(() => {
    cy.viewport(1280, 720);
});

it("should have a populated frontpage", () => {
    cy.visit("/integration-tests/base");
    cy.get("main h1")
        .should("be.visible")
        .and("contain.text", "Integration test: base");
    cy.get("main p")
        .should("be.visible")
        .and("contain.text", "Lorem ipsum dolor frontpage amet.");
});

describe("cookieProcessor", () => {
    beforeEach(() => {
        cy.visit("/integration-tests/base");
    });

    it("should display cookie warning", () => {
        cy.get(".cookie-warning").should("be.visible");
        cy.get(".cookie-warning h1")
            .should("be.visible")
            .and("contain.text", "Cookies on this website");
    });

    it("should be dismissed by accepting", () => {
        cy.get(".cookie-warning").should("be.visible");
        cy.get(".cookie-warning button")
            .contains("Yes, I accept all cookies")
            .click();
        cy.get(".cookie-warning").should("not.be.visible");
        cy.reload();
        cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting -- would not be present right away
        cy.get(".cookie-warning").should("not.be.visible");
    });

    it("should be dismissed by dismissing", () => {
        cy.get(".cookie-warning").should("be.visible");
        cy.get(".cookie-warning button")
            .contains("No, I only accept necessary cookies")
            .click();
        cy.get(".cookie-warning").should("not.be.visible");
        cy.reload();
        cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting -- would not be present right away
        cy.get(".cookie-warning").should("not.be.visible");
    });
});

describe("motdProcessor", () => {
    beforeEach(() => {
        cy.session("cookie-warning", () => {
            cy.visit("/");
            cy.setCookie("doc-hide-cookie-warning", "");
        });
        cy.visit("/integration-tests/base");
    });

    it("should display a message", () => {
        cy.get(".docs-motd")
            .should("have.length", 1)
            .and("contain.text", "Message of the day");
    });
});

describe("searchProcessor", () => {
    beforeEach(() => {
        cy.session("cookie-warning", () => {
            cy.visit("/");
            cy.setCookie("doc-hide-cookie-warning", "");
        });
        cy.visit("/integration-tests/base");
    });

    it("should add search widget to site", () => {
        cy.get("#search").should("be.visible");
    });

    it("should open search modal when clicked", () => {
        cy.get("#search-dialog").should("not.be.visible");
        cy.get("#search button").click();
        cy.get("#search-dialog").should("be.visible");
    });

    it("should open search modal when using keyboard shortcut", () => {
        cy.get("#search-dialog").should("not.be.visible");
        cy.get("body").type("{ctrl}k");
        cy.get("#search-dialog").should("be.visible");
    });

    it("should display search results", () => {
        cy.get("#search button").click();
        cy.get("#search-dialog").should("be.visible");
        cy.get("#search-dialog .docs-search-result__item").should(
            "have.length",
            0,
        );
        cy.get("#search-dialog input").type("fo");
        cy.get("#search-dialog .docs-search-result__item").should(
            "have.length",
            1,
        );
    });
});

describe("selectableVersionProcessor", () => {
    beforeEach(() => {
        cy.session("cookie-warning", () => {
            cy.visit("/");
            cy.setCookie("doc-hide-cookie-warning", "");
        });
        cy.visit("/integration-tests/base");
    });

    it("should add version selector widget to site", () => {
        cy.get("#version").should("be.visible");
    });

    it("should open version selector modal when clicked", () => {
        cy.get("#version-dialog").should("not.be.visible");
        cy.get("#version button").click();
        cy.get("#version-dialog").should("be.visible");
    });
});

describe("versionProcessor", () => {
    beforeEach(() => {
        cy.session("cookie-warning", () => {
            cy.visit("/");
            cy.setCookie("doc-hide-cookie-warning", "");
        });
        cy.visit("/integration-tests/base");
    });
});
