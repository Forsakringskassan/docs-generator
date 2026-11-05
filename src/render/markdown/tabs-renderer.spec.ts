import dedent from "dedent";
import { expect, it } from "vitest";
import { type DocumentPage } from "../../document";
import { createMarkdownRenderer } from "../create-markdown-renderer";

const doc: DocumentPage = {
    kind: "page",
    id: "tabs-test",
    name: "tabs-test",
    alias: [],
    visible: true,
    attributes: {
        search: { terms: [] },
        sortorder: Infinity,
        redirectFrom: [],
    },
    body: "",
    outline: [],
    format: "markdown",
    tags: [],
    template: "",
    fileInfo: {
        fullPath: "tabs-test.md",
        name: "tabs-test",
        path: "",
        outputName: false,
    },
};

const renderer = createMarkdownRenderer({
    docs: [],
    addResource: () => undefined,
    generateExample() {
        throw new Error("No examples are expected in this test");
    },
    getImportedSource() {
        throw new Error("No imported source is expected in this test");
    },
    handleSoftError(error) {
        throw error;
    },
});

it("2.1 - should render multiple tabs and their content from one Markdown source", () => {
    expect.assertions(5);
    const source = dedent`
        §§§ First tab

        Content in the first tab.

        §§§ Second tab

        Content in the second tab.

        §§§
    `;

    const result = renderer.render(doc, source);

    expect(result.match(/class="docs-tabpanel hidden-tabpanel"/g)).toHaveLength(
        2,
    );
    expect(result).toContain('id="tabpanel-first-tab"');
    expect(result).toContain(
        '<p class="docs-paragraph">Content in the first tab.</p>',
    );
    expect(result).toContain('id="tabpanel-second-tab"');
    expect(result).toContain(
        '<p class="docs-paragraph">Content in the second tab.</p>',
    );
});

it("should generate tab and panel IDs using lowercase letters, numbers, and hyphens", () => {
    expect.assertions(4);
    const source = dedent`
        §§§ Cat breeds "Like we know" :D 67

        Content.

        §§§
    `;

    const result = renderer.render(doc, source);

    expect(result).toContain('id="tab-cat-breeds-like-we-know-d-67"');
    expect(result).toContain('id="tabpanel-cat-breeds-like-we-know-d-67"');
    expect(result).toContain(
        'aria-controls="tabpanel-cat-breeds-like-we-know-d-67"',
    );
    expect(result).toContain(
        'aria-labelledby="tab-cat-breeds-like-we-know-d-67"',
    );
});
