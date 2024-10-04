/* eslint-disable jest/no-large-snapshots -- want them inline in this case */

import dedent from "dedent";
import markdownIt from "markdown-it";
import markdownItDeflist from "markdown-it-deflist";

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
md.use(markdownItDeflist);

it("should render definition list", () => {
    expect.assertions(1);
    const source = dedent`
        term
        : definition
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <dl>
        <dt>term</dt>
        <dd>definition</dd>
        </dl>
    `);
});

it("should render multiple terms", () => {
    expect.assertions(1);
    const source = dedent`
        term
        : definition 1
        : definition 2
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <dl>
        <dt>term</dt>
        <dd>definition 1</dd>
        <dd>definition 2</dd>
        </dl>
    `);
});

it("should render markdown content inside term and definition", () => {
    expect.assertions(1);
    const source = dedent`
        foo *bar* baz
        : lorem *ipsum dolor* sit amet
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <dl>
        <dt>foo <em>bar</em> baz</dt>
        <dd>lorem <em>ipsum dolor</em> sit amet</dd>
        </dl>
    `);
});

it("should render lists inside definition", () => {
    expect.assertions(1);
    const source = dedent`
        term
        : definition

            * foo
            * bar
            * baz
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <dl>
        <dt>term</dt>
        <dd>
        <p>definition</p>
        <ul>
        <li>foo</li>
        <li>bar</li>
        <li>baz</li>
        </ul>
        </dd>
        </dl>
    `);
});

it("should render nested definition lists", () => {
    expect.assertions(1);
    const source = dedent`
        term
        : definition

            first nested term
            : inner definition 1
            : inner definition 2

            second nested term
            : inner definition 1
            : inner definition 2
    `;
    const result = md.render(source);
    expect(result).toMatchInlineSnapshot(`
        <dl>
        <dt>term</dt>
        <dd>
        <p>definition</p>
        <dl>
        <dt>first nested term</dt>
        <dd>inner definition 1</dd>
        <dd>inner definition 2</dd>
        <dt>second nested term</dt>
        <dd>inner definition 1</dd>
        <dd>inner definition 2</dd>
        </dl>
        </dd>
        </dl>
    `);
});
