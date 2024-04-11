import markdownIt from "markdown-it";
import { headingLevel } from "./heading-level";

let md: markdownIt;

beforeEach(() => {
    md = markdownIt();
});

it("should render headings", () => {
    expect.assertions(2);
    md.use(headingLevel({ initialLevel: 1 }));
    expect(md.render(`# foo`, { ids: new Set() })).toMatchInlineSnapshot(
        `"<h1 id="foo"><a class="header-anchor" href="#foo">foo</a></h1>"`,
    );
    expect(md.render(`## bar`, { ids: new Set() })).toMatchInlineSnapshot(
        `"<h2 id="bar"><a class="header-anchor" href="#bar">bar</a></h2>"`,
    );
});

it("should remap heading level", () => {
    expect.assertions(2);
    md.use(headingLevel({ initialLevel: 2 }));
    expect(md.render(`# foo`, { ids: new Set() })).toMatchInlineSnapshot(
        `"<h2 id="foo"><a class="header-anchor" href="#foo">foo</a></h2>"`,
    );
    expect(md.render(`## bar`, { ids: new Set() })).toMatchInlineSnapshot(
        `"<h3 id="bar"><a class="header-anchor" href="#bar">bar</a></h3>"`,
    );
});

it("should sluggify id", () => {
    expect.assertions(1);
    md.use(headingLevel({ initialLevel: 1 }));
    expect(
        md.render(`# lorem \`ipsum\` dolor! (test)`, { ids: new Set() }),
    ).toMatchInlineSnapshot(
        `"<h1 id="lorem_ipsum_dolor_test"><a class="header-anchor" href="#lorem_ipsum_dolor_test">lorem <code>ipsum</code> dolor! (test)</a></h1>"`,
    );
});

it("should sluggify version number (from changelog)", () => {
    expect.assertions(1);
    md.use(headingLevel({ initialLevel: 1 }));
    expect(
        md.render(`# 1.2.3 (2012-12-12)`, { ids: new Set() }),
    ).toMatchInlineSnapshot(
        `"<h1 id="v1-2-3"><a class="header-anchor" href="#v1-2-3">1.2.3 (2012-12-12)</a></h1>"`,
    );
});
