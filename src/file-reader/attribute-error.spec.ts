import { findLocation, AttributeError } from "./attribute-error";

expect.addSnapshotSerializer({
    test() {
        return true;
    },
    serialize(value: string) {
        return value;
    },
});

const markdown = [
    "---",
    "foobar: 1",
    "kalle-anka: 2",
    "sort-order: 3",
    "---",
    "",
    "lorem ipsum dolor sit amet",
].join("\n");

describe("findLocation()", () => {
    it("should find location of attribute in frontmatter block", () => {
        expect.assertions(1);
        const location = findLocation(markdown, "kalle-anka");
        expect(location).toEqual({
            start: { line: 3, column: 1 },
            end: { line: 3, column: 11 },
        });
    });

    it("should return null if attribute cannot be found", () => {
        expect.assertions(1);
        const location = findLocation(markdown, "spam");
        expect(location).toBeNull();
    });
});

describe("prettyError()", () => {
    it("should show codeframe and suggestion", () => {
        expect.assertions(1);
        const error = new AttributeError({
            attribute: "sort-order",
            filePath: "mock-file.md",
            content: markdown,
        });
        expect(error.prettyError()).toMatchInlineSnapshot(`
            Unknown attribute "sort-order" in "mock-file.md"

              2 | foobar: 1
              3 | kalle-anka: 2
            > 4 | sort-order: 3
                | ^^^^^^^^^^ Did you mean to use "sortorder"?
              5 | ---
              6 |
              7 | lorem ipsum dolor sit amet
        `);
    });

    it("should show codeframe and generic error", () => {
        expect.assertions(1);
        const error = new AttributeError({
            attribute: "kalle-anka",
            filePath: "mock-file.md",
            content: markdown,
        });
        expect(error.prettyError()).toMatchInlineSnapshot(`
            Unknown attribute "kalle-anka" in "mock-file.md"

              1 | ---
              2 | foobar: 1
            > 3 | kalle-anka: 2
                | ^^^^^^^^^^ Unknown attribute "kalle-anka"
              4 | sort-order: 3
              5 | ---
              6 |
        `);
    });

    it("should show suggestion", () => {
        expect.assertions(1);
        const error = new AttributeError({
            attribute: "srt-order",
            filePath: "mock-file.md",
            content: markdown,
        });
        expect(error.prettyError()).toMatchInlineSnapshot(`
            Unknown attribute "srt-order" in "mock-file.md"

            Did you mean to use "sortorder"?
        `);
    });

    it("should show generic message", () => {
        expect.assertions(1);
        const error = new AttributeError({
            attribute: "unknown-attribute",
            filePath: "mock-file.md",
            content: markdown,
        });
        expect(error.prettyError()).toMatchInlineSnapshot(
            `Unknown attribute "unknown-attribute" in "mock-file.md"`,
        );
    });
});
