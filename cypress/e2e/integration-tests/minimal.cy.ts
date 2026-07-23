beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit("/integration-tests/minimal");
});

it("should have a populated frontpage", () => {
    cy.get("main h1")
        .should("be.visible")
        .and("contain.text", "Integration test: minimal");
    cy.get("main p")
        .should("be.visible")
        .and("contain.text", "Lorem ipsum dolor frontpage amet.");
});

it("should have a populated topnav", () => {
    cy.get("#topnav .docs-topnav__item:not(.docs-topnav__item--more)")
        .should("be.visible")
        .and("have.length", 3)
        .and("contain.text", "Foo")
        .and("contain.text", "Bar")
        .and("contain.text", "Baz");
});

describe("Foo", () => {
    beforeEach(() => {
        cy.get("#topnav .docs-topnav__item").contains("Foo").click();
    });

    it("should be populated", () => {
        cy.get("main h1").should("be.visible").and("contain.text", "Foo");
        cy.get("main p")
            .should("be.visible")
            .and("contain.text", "Lorem ipsum dolor foo amet.");
    });

    it("should have a populated sidenav", () => {
        cy.get("#sidenav .link")
            .should("be.visible")
            .and("have.length", 4)
            .and("contain.text", "Foo")
            .and("contain.text", "First")
            .and("contain.text", "Second")
            .and("contain.text", "Third");
    });

    it("should have navigatable sidenav", () => {
        cy.get("#sidenav .link").contains("Foo").click();
        cy.get("main h1").should("be.visible").and("contain.text", "Foo");
        cy.get("main p")
            .should("be.visible")
            .and("contain.text", "Lorem ipsum dolor foo amet.");

        cy.get("#sidenav .link").contains("First").click();
        cy.get("main h1").should("be.visible").and("contain.text", "First");
        cy.get("main p")
            .should("be.visible")
            .and("contain.text", "Foo subpage 1.");

        cy.get("#sidenav .link").contains("Second").click();
        cy.get("main h1").should("be.visible").and("contain.text", "Second");
        cy.get("main p")
            .should("be.visible")
            .and("contain.text", "Foo subpage 2.");

        cy.get("#sidenav .link").contains("Third").click();
        cy.get("main h1").should("be.visible").and("contain.text", "Third");
        cy.get("main p")
            .should("be.visible")
            .and("contain.text", "Foo subpage 3.");
    });
});

describe("Bar", () => {
    beforeEach(() => {
        cy.get("#topnav .docs-topnav__item").contains("Bar").click();
    });

    it("should be populated", () => {
        cy.get("main h1").should("be.visible").and("contain.text", "Bar");
        cy.get("main p")
            .should("be.visible")
            .and("contain.text", "Lorem ipsum dolor bar amet.");
    });

    it("should have a populated sidenav", () => {
        cy.get("#sidenav .link")
            .should("be.visible")
            .and("have.length", 1)
            .and("contain.text", "Bar");
    });
});

describe("Baz", () => {
    beforeEach(() => {
        cy.get("#topnav .docs-topnav__item").contains("Baz").click();
    });

    it("should be populated", () => {
        cy.get("main h1").should("be.visible").and("contain.text", "Baz");
        cy.get("main p")
            .should("be.visible")
            .and("contain.text", "Lorem ipsum dolor baz amet.");
    });

    it("should have a populated sidenav", () => {
        cy.get("#sidenav .link")
            .should("be.visible")
            .and("have.length", 1)
            .and("contain.text", "Baz");
    });
});
