/**
 * @jest-environment jsdom
 */
import markdownIt from "markdown-it";
import { headingLevel } from "./heading-level";

let md: markdownIt;

beforeEach(() => {
    md = markdownIt();
});

it("should render headings", () => {
    expect.assertions(3);
    md.use(headingLevel({ initialLevel: 1 }));
    expect(md.render(`# foo`, { ids: new Set() })).toMatchInlineSnapshot(
        `"<h1 id="foo" class="docs-heading docs-heading--h1"><a class="header-anchor" href="#foo">foo</a></h1>"`,
    );
    expect(md.render(`## bar`, { ids: new Set() })).toMatchInlineSnapshot(
        `"<h2 id="bar" class="docs-heading docs-heading--h2"><a class="header-anchor" href="#bar">bar</a></h2>"`,
    );
    expect(md.render(`### baz`, { ids: new Set() })).toMatchInlineSnapshot(
        `"<h3 id="baz" class="docs-heading docs-heading--h3"><a class="header-anchor" href="#baz">baz</a></h3>"`,
    );
});

it("should remap heading level", () => {
    expect.assertions(3);
    md.use(headingLevel({ initialLevel: 2 }));
    expect(md.render(`# foo`, { ids: new Set() })).toMatchInlineSnapshot(
        `"<h2 id="foo" class="docs-heading docs-heading--h1"><a class="header-anchor" href="#foo">foo</a></h2>"`,
    );
    expect(md.render(`## bar`, { ids: new Set() })).toMatchInlineSnapshot(
        `"<h3 id="bar" class="docs-heading docs-heading--h2"><a class="header-anchor" href="#bar">bar</a></h3>"`,
    );
    expect(md.render(`### baz`, { ids: new Set() })).toMatchInlineSnapshot(
        `"<h4 id="baz" class="docs-heading docs-heading--h3"><a class="header-anchor" href="#baz">baz</a></h4>"`,
    );
});

it("should sluggify id", () => {
    expect.assertions(1);
    md.use(headingLevel({ initialLevel: 1 }));
    expect(
        md.render(`# lorem \`ipsum\` dolor! (test)`, { ids: new Set() }),
    ).toMatchInlineSnapshot(
        `"<h1 id="lorem_ipsum_dolor_test" class="docs-heading docs-heading--h1"><a class="header-anchor" href="#lorem_ipsum_dolor_test">lorem <code>ipsum</code> dolor! (test)</a></h1>"`,
    );
});

it("should sluggify version number (from changelog)", () => {
    expect.assertions(1);
    md.use(headingLevel({ initialLevel: 1 }));
    expect(
        md.render(`# 1.2.3 (2012-12-12)`, { ids: new Set() }),
    ).toMatchInlineSnapshot(
        `"<h1 id="v1-2-3" class="docs-heading docs-heading--h1"><a class="header-anchor" href="#v1-2-3">1.2.3 (2012-12-12)</a></h1>"`,
    );
});

it("should add docs-heading class to all headings", () => {
    expect.assertions(3);
    md.use(headingLevel({ initialLevel: 1 }));
    const markdown = ["# h1", "## h2", "### h3"].join("\n");
    const container = document.createElement("div");
    container.innerHTML = md.render(markdown, { ids: new Set() });
    const h1 = container.querySelector("h1")!;
    const h2 = container.querySelector("h2")!;
    const h3 = container.querySelector("h3")!;
    expect(h1.classList).toContain("docs-heading");
    expect(h2.classList).toContain("docs-heading");
    expect(h3.classList).toContain("docs-heading");
});

it("should add level-specific class matching the rendered heading level", () => {
    expect.assertions(3);
    md.use(headingLevel({ initialLevel: 1 }));
    const markdown = ["# h1", "## h2", "### h3"].join("\n");
    const container = document.createElement("div");
    container.innerHTML = md.render(markdown, { ids: new Set() });
    const h1 = container.querySelector("h1")!;
    const h2 = container.querySelector("h2")!;
    const h3 = container.querySelector("h3")!;
    expect(h1.classList).toContain("docs-heading--h1");
    expect(h2.classList).toContain("docs-heading--h2");
    expect(h3.classList).toContain("docs-heading--h3");
});

it("should preserve original Markdown level in class modifier when heading level is remapped", () => {
    expect.assertions(3);
    md.use(headingLevel({ initialLevel: 3 }));
    const markdown = ["# h1", "## h2", "### h3"].join("\n");
    const container = document.createElement("div");
    container.innerHTML = md.render(markdown, { ids: new Set() });
    const h3 = container.querySelector("h3")!;
    const h4 = container.querySelector("h4")!;
    const h5 = container.querySelector("h5")!;
    expect(h3.classList).toContain("docs-heading--h1");
    expect(h4.classList).toContain("docs-heading--h2");
    expect(h5.classList).toContain("docs-heading--h3");
});
