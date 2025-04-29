import dedent from "dedent";
import markdownIt from "markdown-it";
import { type FileInfo } from "../../../document";
import { containerParser } from "../container-renderer";
import { type ContainerContext } from "./container-context";
import { messageboxContainer } from "./messagebox-container";

expect.addSnapshotSerializer({
    test() {
        return true;
    },
    serialize(value: string) {
        return dedent(value)
            .split(/\n/g)
            .map((it) => it.trimEnd())
            .filter((it) => it.length > 0)
            .join("\n");
    },
});

const md = markdownIt();
const context: ContainerContext = {
    md,
    env: {
        fileInfo: {} as FileInfo,
        ids: new Set(),
        currentHeading: 1,
        namedExamples: new Map(),
    },
    doc: {
        kind: "partial",
        id: "mock-document",
        name: "mock-document",
        alias: [],
        body: "",
        format: "html",
        fileInfo: { fullPath: undefined },
    },
    docs: [],
    included: new Map(),
    dependencies: new Set(),
    handleSoftError(err) {
        throw err;
    },
};

md.use(containerParser, {
    messagebox: messageboxContainer(context, {
        title: {
            warning: "Localized title for warning",
            danger: "",
            custom: "Custom title",
        },
    }),
    info: messageboxContainer(context, { title: {} }, "info"),
});

it("should render messagebox with default variant", () => {
    expect.assertions(1);
    const source = dedent`
        ::: messagebox
        foo
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <div class="docs-messagebox docs-messagebox--info">
            <p class="docs-messagebox__title">INFO</p>
            <p>foo</p>
        </div>
    `);
});

it("should render messagebox with explicit variant", () => {
    expect.assertions(1);
    const source = dedent`
        ::: messagebox info
        foo
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <div class="docs-messagebox docs-messagebox--info">
            <p class="docs-messagebox__title">INFO</p>
            <p>foo</p>
        </div>
    `);
});

it("should render messagebox with aliased name", () => {
    expect.assertions(1);
    const source = dedent`
        ::: info
        foo
        :::

        ::: info with title
        bar
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <div class="docs-messagebox docs-messagebox--info">
            <p class="docs-messagebox__title">INFO</p>
            <p>foo</p>
        </div>
        <div class="docs-messagebox docs-messagebox--info">
            <p class="docs-messagebox__title">with title</p>
            <p>bar</p>
        </div>
    `);
});

it("should render custom heading", () => {
    expect.assertions(1);
    const source = dedent`
        ::: messagebox info Lorem ipsum
        dolor sit amet
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <div class="docs-messagebox docs-messagebox--info">
            <p class="docs-messagebox__title">Lorem ipsum</p>
            <p>dolor sit amet</p>
        </div>
    `);
});

it("should render custom variant", () => {
    expect.assertions(1);
    const source = dedent`
        ::: messagebox custom
        foo
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <div class="docs-messagebox docs-messagebox--custom">
            <p class="docs-messagebox__title">Custom title</p>
            <p>foo</p>
        </div>
    `);
});

it("should render nested markdown", () => {
    expect.assertions(1);
    const source = dedent`
        ::: info foo \`bar\` baz

        * foo **bar** baz

        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <div class="docs-messagebox docs-messagebox--info">
            <p class="docs-messagebox__title">foo <code>bar</code> baz</p>
            <ul>
        <li>foo <strong>bar</strong> baz</li>
        </ul>
        </div>
    `);
});

it("should handle missing leading space", () => {
    expect.assertions(1);
    const source = dedent`
        :::messagebox
        foo
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <div class="docs-messagebox docs-messagebox--info">
            <p class="docs-messagebox__title">INFO</p>
            <p>foo</p>
        </div>
    `);
});

it("should handle custom variant without localization", () => {
    expect.assertions(1);
    const source = dedent`
        ::: messagebox without-localization
        foo
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <div class="docs-messagebox docs-messagebox--without-localization">
            <p>foo</p>
        </div>
    `);
});

it("should use localized title", () => {
    expect.assertions(1);
    /* tip is configured with a localized title */
    const source = dedent`
        ::: messagebox warning
        foo
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <div class="docs-messagebox docs-messagebox--warning">
            <p class="docs-messagebox__title">Localized title for warning</p>
            <p>foo</p>
        </div>
    `);
});

it("should disable title if localization is empty string", () => {
    expect.assertions(1);
    /* danger is configured with empty title */
    const source = dedent`
        ::: messagebox danger
        foo
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <div class="docs-messagebox docs-messagebox--danger">
            <p>foo</p>
        </div>
    `);
});
