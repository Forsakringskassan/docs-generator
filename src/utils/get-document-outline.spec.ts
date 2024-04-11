import { getDocumentOutline } from "./get-document-outline";

describe("markdown", () => {
    it("single header", () => {
        expect.assertions(1);
        const markdown = `
## foo
`;
        const outline = getDocumentOutline(markdown, "markdown");
        expect(outline).toEqual([
            {
                title: "foo",
                rank: 2,
                anchor: "foo",
                subheadings: [],
            },
        ]);
    });

    it("multiple headers", () => {
        expect.assertions(1);
        const markdown = `
## foo
## bar
## baz
`;
        const outline = getDocumentOutline(markdown, "markdown");
        expect(outline).toEqual([
            {
                title: "foo",
                rank: 2,
                anchor: "foo",
                subheadings: [],
            },
            {
                title: "bar",
                rank: 2,
                anchor: "bar",
                subheadings: [],
            },
            {
                title: "baz",
                rank: 2,
                anchor: "baz",
                subheadings: [],
            },
        ]);
    });

    it("nested headers", () => {
        expect.assertions(1);
        const markdown = `
## foo
### bar
#### baz
`;
        const outline = getDocumentOutline(markdown, "markdown");
        expect(outline).toEqual([
            {
                title: "foo",
                rank: 2,
                anchor: "foo",
                subheadings: [
                    {
                        title: "bar",
                        rank: 3,
                        anchor: "bar",
                        subheadings: [
                            {
                                title: "baz",
                                rank: 4,
                                anchor: "baz",
                                subheadings: [],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it("should handle decrementing heading ranks", () => {
        expect.assertions(1);
        const markdown = `
## foo
### bar
## baz
`;
        const outline = getDocumentOutline(markdown, "markdown");
        expect(outline).toEqual([
            {
                title: "foo",
                rank: 2,
                anchor: "foo",
                subheadings: [
                    {
                        title: "bar",
                        rank: 3,
                        anchor: "bar",
                        subheadings: [],
                    },
                ],
            },
            {
                title: "baz",
                rank: 2,
                anchor: "baz",
                subheadings: [],
            },
        ]);
    });

    it("should handle skipping ranks", () => {
        expect.assertions(1);
        const markdown = `
## foo
#### bar
## baz
`;
        const outline = getDocumentOutline(markdown, "markdown");
        expect(outline).toEqual([
            {
                title: "foo",
                rank: 2,
                anchor: "foo",
                subheadings: [
                    {
                        title: "bar",
                        rank: 4,
                        anchor: "bar",
                        subheadings: [],
                    },
                ],
            },
            {
                title: "baz",
                rank: 2,
                anchor: "baz",
                subheadings: [],
            },
        ]);
    });

    it("should handle ranks in reverse order", () => {
        expect.assertions(1);
        const markdown = `
### foo
## bar
`;
        const outline = getDocumentOutline(markdown, "markdown");
        expect(outline).toEqual([
            {
                title: "foo",
                rank: 3,
                anchor: "foo",
                subheadings: [],
            },
            {
                title: "bar",
                rank: 2,
                anchor: "bar",
                subheadings: [],
            },
        ]);
    });
});
