const groupExpandable = '#docs-sidenav details:contains("Expandable group")';
const summaryExpandable = '#docs-sidenav summary:contains("Expandable group")';
const activeLink = "#docs-sidenav li.link.active";
const activeGroup = "#docs-sidenav li.expandable.active";
const linkChangelog = '#docs-sidenav a:contains("Link to Changelog")';
const linkSite = '#docs-sidenav a:contains("Link to external site")';
const linkChild2 = '#docs-sidenav a:contains("Child Page 2")';
const linkNested3 = '#docs-sidenav a:contains("Nested Page 3")';
const footerChangelog = 'footer a:contains("Changelog")';

beforeEach(() => {
    cy.viewport(1280, 720);
});

it("internal links in sidebar should remain correct while navigating", () => {
    cy.visit("/navigation");
    cy.get(groupExpandable).click();
    cy.get(linkChild2).should("have.attr", "href", "./child-page-2.html");
    cy.get(linkNested3).should(
        "have.attr",
        "href",
        "./group/nested-page-3.html",
    );

    cy.get(linkChild2).click();
    cy.get(linkChild2).should("have.attr", "href", "./child-page-2.html");
    cy.get(linkNested3).should(
        "have.attr",
        "href",
        "./group/nested-page-3.html",
    );

    cy.get(linkNested3).click();
    cy.get(linkChild2).should("have.attr", "href", "../child-page-2.html");
    cy.get(linkNested3).should("have.attr", "href", "./nested-page-3.html");
});

it("internal links in sidebar should remain correct while navigating (hard reload)", () => {
    cy.visit("/navigation");
    cy.get(groupExpandable).click();
    cy.get(linkChild2).should("have.attr", "href", "./child-page-2.html");
    cy.get(linkNested3).should(
        "have.attr",
        "href",
        "./group/nested-page-3.html",
    );

    cy.get(linkChild2).click();
    cy.reload();
    cy.get(groupExpandable).click();
    cy.get(linkChild2).should("have.attr", "href", "./child-page-2.html");
    cy.get(linkNested3).should(
        "have.attr",
        "href",
        "./group/nested-page-3.html",
    );

    cy.get(linkNested3).click();
    cy.reload();
    cy.get(groupExpandable).click();
    cy.get(linkChild2).should("have.attr", "href", "../child-page-2.html");
    cy.get(linkNested3).should("have.attr", "href", "./nested-page-3.html");
});

it("external links in sidebar should remain correct while navigating", () => {
    cy.visit("/navigation");
    cy.get(linkChangelog).should("have.attr", "href", "../changelog.html");
    cy.get(linkSite).should(
        "have.attr",
        "href",
        "https://developer.mozilla.org/",
    );

    cy.get(linkChild2).click();
    cy.get(linkChangelog).should("have.attr", "href", "../changelog.html");
    cy.get(linkSite).should(
        "have.attr",
        "href",
        "https://developer.mozilla.org/",
    );

    cy.get(groupExpandable).click();
    cy.get(linkNested3).click();
    cy.get(linkChangelog).should("have.attr", "href", "../../changelog.html");
    cy.get(linkSite).should(
        "have.attr",
        "href",
        "https://developer.mozilla.org/",
    );
});

it("external links in sidebar should remain correct while navigating (hard reload)", () => {
    cy.visit("/navigation");
    cy.get(linkChangelog).should("have.attr", "href", "../changelog.html");
    cy.get(linkSite).should(
        "have.attr",
        "href",
        "https://developer.mozilla.org/",
    );

    cy.get(linkChild2).click();
    cy.reload();
    cy.get(linkChangelog).should("have.attr", "href", "../changelog.html");
    cy.get(linkSite).should(
        "have.attr",
        "href",
        "https://developer.mozilla.org/",
    );

    cy.get(groupExpandable).click();
    cy.get(linkNested3).click();
    cy.reload();
    cy.get(linkChangelog).should("have.attr", "href", "../../changelog.html");
    cy.get(linkSite).should(
        "have.attr",
        "href",
        "https://developer.mozilla.org/",
    );
});

it("active link in sidebar should follow clicked link", () => {
    cy.visit("/navigation");
    cy.get("main h1").should("contain.text", "Navigation");
    cy.get(activeLink).should("contain.text", "Navigation");

    cy.get(linkChild2).click();
    cy.get("main h1").should("contain.text", "Child Page 2");
    cy.get(activeLink).should("contain.text", "Child Page 2");
});

it("active link in sidebar should follow browser back", () => {
    cy.visit("/navigation");
    cy.get(linkChild2).click();
    cy.get("main h1").should("contain.text", "Child Page 2");
    cy.get(activeLink).should("contain.text", "Child Page 2");

    cy.go("back");
    cy.get("main h1").should("contain.text", "Navigation");
    cy.get(activeLink).should("contain.text", "Navigation");
});

it("active link in sidebar should follow browser forward", () => {
    cy.visit("/navigation");
    cy.get(linkChild2).click();
    cy.get("main h1").should("contain.text", "Child Page 2");
    cy.get(activeLink).should("contain.text", "Child Page 2");

    cy.go("back");
    cy.get("main h1").should("contain.text", "Navigation");
    cy.get(activeLink).should("contain.text", "Navigation");

    cy.go("forward");
    cy.get("main h1").should("contain.text", "Child Page 2");
    cy.get(activeLink).should("contain.text", "Child Page 2");
});

it("group in sidebar should be active when it contains the active link", () => {
    cy.visit("/navigation");
    cy.get(activeGroup).should("not.exist");

    cy.get(groupExpandable).click();
    cy.get(linkNested3).click();
    cy.get("main h1").should("contain.text", "Nested Page 3");
    cy.get(activeLink).should("contain.text", "Nested Page 3");
    cy.get(activeGroup).should("contain.text", "Expandable group");
});

it("group in sidebar should not be active after navigating back to a link outside it", () => {
    cy.visit("/navigation");
    cy.get(groupExpandable).click();
    cy.get(linkNested3).click();
    cy.get("main h1").should("contain.text", "Nested Page 3");
    cy.get(activeLink).should("contain.text", "Nested Page 3");
    cy.get(activeGroup).should("contain.text", "Expandable group");

    cy.go("back");
    cy.get("main h1").should("contain.text", "Navigation");
    cy.get(activeLink).should("contain.text", "Navigation");
    cy.get(activeGroup).should("not.exist");
});

it("collapsed group in sidebar should be expanded when navigating back to a link inside it", () => {
    cy.visit("/navigation");
    cy.get(groupExpandable).click();
    cy.get(linkNested3).click();
    cy.get("main h1").should("contain.text", "Nested Page 3");
    cy.get(linkChild2).click();
    cy.get("main h1").should("contain.text", "Child Page 2");

    /* Collapses group so link to previous page is hidden */
    cy.get(summaryExpandable).click();
    cy.get(linkNested3).should("not.be.visible");

    cy.go("back");
    cy.get("main h1").should("contain.text", "Nested Page 3");
    cy.get(activeLink).should("contain.text", "Nested Page 3");
    cy.get(groupExpandable).should("have.attr", "open");
    cy.get(linkNested3).should("be.visible");
});

it("links in footer should remain correct while navigating", () => {
    cy.visit("/navigation");
    cy.get(footerChangelog).should("have.attr", "href", "../changelog.html");

    cy.get(linkChild2).click();
    cy.get(footerChangelog).should("have.attr", "href", "../changelog.html");

    cy.get(groupExpandable).click();
    cy.get(linkNested3).click();
    cy.get(footerChangelog).should("have.attr", "href", "../../changelog.html");
});

it("links in footer should remain correct while navigating (hard reload)", () => {
    cy.visit("/navigation");
    cy.get(footerChangelog).should("have.attr", "href", "../changelog.html");

    cy.get(linkChild2).click();
    cy.reload();
    cy.get(footerChangelog).should("have.attr", "href", "../changelog.html");

    cy.get(groupExpandable).click();
    cy.get(linkNested3).click();
    cy.reload();
    cy.get(footerChangelog).should("have.attr", "href", "../../changelog.html");
});
