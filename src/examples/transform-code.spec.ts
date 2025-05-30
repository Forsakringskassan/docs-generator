import dedent from "dedent";
import { transformCode } from "./transform-code";

expect.addSnapshotSerializer({
    test() {
        return true;
    },
    serialize(value: string) {
        return value;
    },
});

it("should retain newlines", () => {
    expect.assertions(6);
    expect(transformCode("", "javascript")).toBe("");
    expect(transformCode("\n", "javascript")).toBe("\n");
    expect(transformCode("\n\n", "javascript")).toBe("\n\n");
    expect(transformCode("a\nb", "javascript")).toBe("a\nb");
    expect(transformCode("a\nb\n", "javascript")).toBe("a\nb\n");
    expect(transformCode("a\nb\n\n", "javascript")).toBe("a\nb\n\n");
});

it("should ignore other languages", () => {
    expect.assertions(3);
    expect(transformCode("/* eslint-disable foo */", "javascript")).toBe("");
    expect(transformCode("/* eslint-disable foo */", "typescript")).toBe("");
    expect(transformCode("/* eslint-disable foo */", "plaintext")).toBe(
        "/* eslint-disable foo */",
    );
});

it("should remove eslint /* .. */ comments", () => {
    expect.assertions(1);
    const source = dedent`
        const foo = 1;
        /* regular comment */
        const bar = /* eslint-disable foo */ 2;
        /* eslint-disable foo -- bar */
        /* eslint-disable-next-line foo -- bar */
        const baz = 3; /* eslint-disable-line foo -- bar */

        function foo(value) {
            /* eslint-disable-next-line eqeqeq */
            return value == "foo";
        }
    `;
    expect(transformCode(source, "javascript")).toMatchInlineSnapshot(`
        const foo = 1;
        /* regular comment */
        const bar = 2;
        const baz = 3;

        function foo(value) {
            return value == "foo";
        }
    `);
});

it("should remove eslint // comments", () => {
    expect.assertions(1);
    const source = dedent`
        const foo = 1; // regular comment
        // eslint-disable foo
        // eslint-disable foo -- bar
        // eslint-disable-next-line foo -- bar
        const bar = 2; // eslint-disable-line foo -- bar

        function foo(value) {
            // eslint-disable-next-line eqeqeq
            return value == "foo";
        }
    `;
    expect(transformCode(source, "javascript")).toMatchInlineSnapshot(`
        const foo = 1; // regular comment
        const bar = 2;

        function foo(value) {
            return value == "foo";
        }
    `);
});

it("should remove html-validate comments", () => {
    expect.assertions(1);
    const source = dedent`
        <!-- [html-validate-disable-block foo -- bar] -->
        <div>
            <!-- [html-validate-disable-next foo -- bar] -->
            <!-- regular comment -->
            <p>lorem <!-- [html-validate-disable-asdf foo -- bar] --> ipsum</p>
        </div>
    `;
    expect(transformCode(source, "html")).toMatchInlineSnapshot(`
        <div>
            <!-- regular comment -->
            <p>lorem ipsum</p>
        </div>
    `);
});

it("should cut above marker (js)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b
        /* --- cut above --- */
        c
        d
    `;
    expect(transformCode(source, "typescript")).toMatchInlineSnapshot(`
        c
        d
    `);
});

it("should cut above marker (html)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b
        <!-- cut above -->
        c
        d
    `;
    expect(transformCode(source, "html")).toMatchInlineSnapshot(`
        c
        d
    `);
});

it("should cut above marker with surrounding newlines (js)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b

        /* --- cut above --- */

        c
        d
    `;
    expect(transformCode(source, "typescript")).toMatchInlineSnapshot(`
        c
        d
    `);
});

it("should cut above marker with surrounding newlines (html)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b

        <!-- cut above -->

        c
        d
    `;
    expect(transformCode(source, "html")).toMatchInlineSnapshot(`
        c
        d
    `);
});

it("should cut below marker (js)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b
        /* --- cut below --- */
        c
        d
    `;
    expect(transformCode(source, "typescript")).toMatchInlineSnapshot(`
        a
        b
    `);
});

it("should cut below marker (html)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b
        <!-- cut below --> */
        c
        d
    `;
    expect(transformCode(source, "html")).toMatchInlineSnapshot(`
        a
        b
    `);
});

it("should cut below marker with surrounding newlines (js)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b

        /* --- cut below --- */

        c
        d
    `;
    expect(transformCode(source, "typescript")).toMatchInlineSnapshot(`
        a
        b
    `);
});

it("should cut below marker with surrounding newlines (html)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b

        <!-- cut below -->

        c
        d
    `;
    expect(transformCode(source, "html")).toMatchInlineSnapshot(`
        a
        b
    `);
});

it("should cut with start and end marker (js)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        /* --- cut begin --- */
        b
        /* --- cut end --- */
        c
    `;
    expect(transformCode(source, "typescript")).toMatchInlineSnapshot(`
        a
        c
    `);
});

it("should cut with start and end marker (html)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        <!-- cut begin -->
        b
        <!--- cut end -->
        c
    `;
    expect(transformCode(source, "html")).toMatchInlineSnapshot(`
        a
        c
    `);
});

it("should cut with start and end marker with surrounding newlines (js)", () => {
    expect.assertions(1);
    const source = dedent`
        a

        /* --- cut begin --- */
        b
        /* --- cut end --- */

        c
    `;
    expect(transformCode(source, "typescript")).toMatchInlineSnapshot(`
        a
        c
    `);
});

it("should cut with start and end marker with surrounding newlines (html)", () => {
    expect.assertions(1);
    const source = dedent`
        a

        <!-- cut begin -->
        b
        <!--- cut end -->

        c
    `;
    expect(transformCode(source, "html")).toMatchInlineSnapshot(`
        a
        c
    `);
});

it("should handle missing end instruction same as cut below (js)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b

        /* --- cut begin --- */

        c
        d
    `;
    expect(transformCode(source, "typescript")).toMatchInlineSnapshot(`
        a
        b
    `);
});

it("should handle missing end instruction same as cut below (html)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b

        <!-- cut begin -->

        c
        d
    `;
    expect(transformCode(source, "html")).toMatchInlineSnapshot(`
        a
        b
    `);
});

it("should handle missing begin instruction same as cut above (js)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b

        /* --- cut end --- */

        c
        d
    `;
    expect(transformCode(source, "typescript")).toMatchInlineSnapshot(`
        c
        d
    `);
});

it("should handle missing begin instruction same as cut above (html)", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b

        <!-- cut end -->

        c
        d
    `;
    expect(transformCode(source, "html")).toMatchInlineSnapshot(`
        c
        d
    `);
});

it("should handle cuts with no other content (js)", () => {
    expect.assertions(3);
    expect(transformCode("/* --- cut above --- */", "javascript")).toBe("");
    expect(transformCode("/* --- cut below --- */", "javascript")).toBe("");
    expect(
        transformCode(
            "/* --- cut begin --- */\n/* --- cut end --- */",
            "javascript",
        ),
    ).toBe("");
});

it("should handle cuts with no other content (html)", () => {
    expect.assertions(3);
    expect(transformCode("<!-- cut above -->", "html")).toBe("");
    expect(transformCode("<!-- cut below -->", "html")).toBe("");
    expect(transformCode("<!-- cut begin -->\n<!-- cut end -->", "html")).toBe(
        "",
    );
});

it("should handle html comment with extra dash", () => {
    expect.assertions(1);
    const source = dedent`
        a
        b
        <!--- cut above --->
        c
        d
    `;
    expect(transformCode(source, "html")).toMatchInlineSnapshot(`
        c
        d
    `);
});
