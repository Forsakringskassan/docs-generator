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
