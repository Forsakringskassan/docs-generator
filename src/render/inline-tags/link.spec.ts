import { createMockDocument } from "../../utils";
import { processInlineTags } from "../process-inline-tags";
import { type SoftErrorType } from "../soft-error";
import { linkTag } from "./link";

expect.addSnapshotSerializer({
    test() {
        return true;
    },
    serialize(value: string) {
        return value;
    },
});

const rethrow = (err: SoftErrorType): never => {
    throw err;
};
const tags = [linkTag];
const doc = createMockDocument("index", "./components/index.html");
const docs = [
    doc,

    /* path related documents */
    createMockDocument("foo", "./components/foo.html"),
    createMockDocument("bar", "./other/bar.html"),
    createMockDocument("baz", "./other/index.html"),

    /* title related documents */
    createMockDocument("with-title", "./components/with-title.html", {
        attributes: {
            title: "Document with title",
            sortorder: Infinity,
            redirectFrom: [],
            search: { terms: [] },
        },
    }),
    createMockDocument("with-name", "./components/with-name.html"),
    createMockDocument("with-components", "./components/f-components.html", {
        alias: ["FFirst", "FSecond"],
        attributes: {
            component: [{ name: "FFirst" }, { name: "FSecond" }],
            sortorder: Infinity,
            redirectFrom: [],
            search: { terms: [] },
        },
    }),
];

it("should replace inline tag with processed content", () => {
    expect.assertions(1);
    const text = "{@link foo}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(`<a href="./foo.html">foo</a>`);
});

it("should create relative links", () => {
    expect.assertions(1);
    const text = "{@link bar}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(`<a href="../other/bar.html">bar</a>`);
});

it("should strip index.html and link directly to folder", () => {
    expect.assertions(1);
    const text = "{@link baz}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(`<a href="../other">baz</a>`);
});

it("should handle linking to index.html in its own folder", () => {
    expect.assertions(1);
    const text = "{@link index}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(`<a href="./">index</a>`);
});

it("should use document title as link title", () => {
    expect.assertions(1);
    const text = "{@link with-title}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(
        `<a href="./with-title.html">Document with title</a>`,
    );
});

it("should use document name as link title", () => {
    expect.assertions(1);
    const text = "{@link with-name}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(
        `<a href="./with-name.html">with-name</a>`,
    );
});

it("should use matching component as link title", () => {
    expect.assertions(1);
    const text = "{@link FFirst}\n{@link FSecond}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(`
        <a href="./f-components.html"><code>FFirst</code></a>
        <a href="./f-components.html"><code>FSecond</code></a>
    `);
});

it("should use explicit title when given", () => {
    expect.assertions(1);
    const text = "{@link with-title My awesome title}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(
        `<a href="./with-title.html">My awesome title</a>`,
    );
});

it("should trim pipe from explicit title (tsdoc compatibility)", () => {
    expect.assertions(1);
    const text = [
        "{@link with-title | My awesome title}",
        "{@link with-title   |   My awesome title}",
    ].join("\n");
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(`
        <a href="./with-title.html">My awesome title</a>
        <a href="./with-title.html">My awesome title</a>
    `);
});

it("should handle hash", () => {
    expect.assertions(1);
    const text = "{@link foo#bar}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(`<a href="./foo.html#bar">foo</a>`);
});

it("should handle hash and title", () => {
    expect.assertions(1);
    const text = "{@link foo#bar Bar at foo}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(
        `<a href="./foo.html#bar">Bar at foo</a>`,
    );
});

it("should handle absolute url (http)", () => {
    expect.assertions(1);
    const text = "{@link http://example.net foo}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(
        `<a href="http://example.net">foo</a>`,
    );
});

it("should handle absolute url (https)", () => {
    expect.assertions(1);
    const text = "{@link https://example.net foo}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(
        `<a href="https://example.net">foo</a>`,
    );
});

it("should handle absolute url with hash", () => {
    expect.assertions(1);
    const text = "{@link https://example.net/foo#bar baz}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(
        `<a href="https://example.net/foo#bar">baz</a>`,
    );
});

it("should handle absolute url without title", () => {
    expect.assertions(1);
    const text = "{@link https://example.net}";
    const result = processInlineTags(tags, doc, docs, text, rethrow);
    expect(result).toMatchInlineSnapshot(
        `<a href="https://example.net">https://example.net</a>`,
    );
});

it("should throw error if linking to non-existing document", () => {
    expect.assertions(1);
    const text = "{@link missing}";
    expect(() => processInlineTags(tags, doc, docs, text, rethrow)).toThrow(
        'Failed to find linked document "missing"',
    );
});
