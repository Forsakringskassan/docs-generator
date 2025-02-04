import dedent from "dedent";
import markdownIt from "markdown-it";
import { type FileInfo } from "../../../document";
import { containerParser } from "../container-renderer";
import { type ContainerContext } from "./container-context";
import { detailsContainer } from "./details-container";

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
        namedExamples: new Map(),
    },
    docs: [],
    included: new Set(),
    handleSoftError(err) {
        throw err;
    },
};

md.use(containerParser, {
    details: detailsContainer(context, { title: {} }),
});

it("should render details", () => {
    expect.assertions(1);
    const source = dedent`
        ::: details
        foo
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <details class="docs-messagebox docs-messagebox--details">
            <summary class="docs-messagebox__title">
                Details
            </summary>
            <p>foo</p>
        </details>
    `);
});

it("should render custom heading", () => {
    expect.assertions(1);
    const source = dedent`
        ::: details Lorem ipsum
        dolor sit amet
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <details class="docs-messagebox docs-messagebox--details">
            <summary class="docs-messagebox__title">
                Lorem ipsum
            </summary>
            <p>dolor sit amet</p>
        </details>
    `);
});

it("should render nested markdown", () => {
    expect.assertions(1);
    const source = dedent`
        ::: details foo \`bar\` baz

        * foo **bar** baz

        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <details class="docs-messagebox docs-messagebox--details">
            <summary class="docs-messagebox__title">
                foo <code>bar</code> baz
            </summary>
            <ul>
        <li>foo <strong>bar</strong> baz</li>
        </ul>
        </details>
    `);
});

it("should use localized title", () => {
    expect.assertions(1);
    const md = markdownIt();
    md.use(containerParser, {
        details: detailsContainer(context, {
            title: { details: "Localized title" },
        }),
    });
    /* tip is configured with a localized title */
    const source = dedent`
        ::: details
        foo
        :::
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <details class="docs-messagebox docs-messagebox--details">
            <summary class="docs-messagebox__title">
                Localized title
            </summary>
            <p>foo</p>
        </details>
    `);
});
