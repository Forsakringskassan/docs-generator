/* eslint-disable @typescript-eslint/no-unused-expressions -- expect style assertions have side-effects */

import { type Manifest } from "../../src";

type ManifestPage = Manifest["pages"][number];
type ManifestExample = ManifestPage["examples"][number];

function hasExample(page: ManifestPage): boolean {
    const liveExamples = page.examples.filter(isLiveExample);
    const vuePreviewExamples = page.examples.filter(isVuePreviewExample);
    return liveExamples.length > 0 || vuePreviewExamples.length > 0;
}

function isLiveExample(example: ManifestExample): boolean {
    return example.tags.includes("live-example");
}

function isVuePreviewExample(example: ManifestExample): boolean {
    return (
        example.language === "vue" &&
        !example.tags.includes("live-example") &&
        !example.tags.includes("static")
    );
}

beforeEach(() => {
    cy.visit("/");
});

describe("should visit all pages and ensure examples load properly", () => {
    let pages = Cypress.expose("pages") ?? [];
    pages = pages.filter(hasExample);

    it("should contain pages with examples", () => {
        cy.wrap(pages.length).should("be.gt", 0);
    });

    for (const page of pages) {
        const { path, examples } = page;

        const liveExamples = examples.filter(isLiveExample);
        const vuePreviewExamples = examples.filter(isVuePreviewExample);

        it(path, () => {
            cy.visit(path);

            for (const example of liveExamples) {
                const selector = example.selector;
                const container = `${selector} .live-example__container`;
                const runtime = `${selector} .live-example__example`;
                const controls = `${selector} .live-example__controls`;
                const code = `${selector} .live-example__code`;
                const toggleCode = `${code} button`;
                const markup = `${code} code`;
                const errorhandler = `${selector} [data-test=f-error-page]`;

                cy.get(container).should(($el) => {
                    expect($el, path).to.exist;
                });
                cy.get(runtime).should(($el) => {
                    expect($el, path).to.exist.and.not.be.empty;
                });
                cy.get(controls).should(($el) => {
                    expect($el, path).to.exist.and.not.be.empty;
                });
                cy.get(code).should(($el) => {
                    expect($el, path).to.exist;
                });

                cy.get(toggleCode).click();
                cy.get(markup).should(($el) => {
                    expect($el, path).to.exist;
                    expect($el.text(), path).not.be.empty;
                });
                cy.get(errorhandler).should(($el) => {
                    expect($el, path).not.to.exist;
                });
            }

            for (const example of vuePreviewExamples) {
                const selector = example.selector;
                const preview = `${selector} .code-preview__preview`;
                const errorhandler = `${selector} [data-test=f-error-page]`;

                cy.get(preview).should(($el) => {
                    expect($el, path).to.exist.and.not.be.empty;
                });
                cy.get(errorhandler).should(($el) => {
                    expect($el, path).not.to.exist;
                });
            }
        });
    }
});
