const groupExpandable = '#sidenav details:contains("Expandable group")';
const linkChangelog = '#sidenav a:contains("Link to Changelog")';
const linkSite = '#sidenav a:contains("Link to external site")';
const linkChild2 = '#sidenav a:contains("Child Page 2")';
const linkNested3 = '#sidenav a:contains("Nested Page 3")';
const footerChangelog = 'footer a:contains("Changelog")';

beforeEach(() => {
    cy.viewport(1280, 720);
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
