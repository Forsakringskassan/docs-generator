beforeEach(() => {
    cy.visit("/markdown/custom-containers.html");
});

it("should render alternative text if file is found", () => {
    cy.get("#content").contains(
        "p",
        "This is an alternative text from another markdown file.",
    );
});

it("should render default text if file is not found", () => {
    cy.get("#content").contains(
        "p",
        "This text will be rendered if the file is not found.",
    );
});
