import { describe, expect, it } from "vitest";
import { parseFile } from "./navigation-file-reader";

describe("parseFile()", () => {
    it("should parse a minimal navigation file", () => {
        expect.assertions(1);
        const content = JSON.stringify({ title: "My title", href: "/foo" });
        const page = parseFile("docs/nav/foo.json", "docs", content);
        expect(page).toEqual({
            kind: "page",
            id: "nav:docs/nav/foo.json",
            name: "foo",
            alias: [],
            visible: true,
            attributes: {
                title: "My title",
                shortTitle: undefined,
                href: "/foo",
                sortorder: Infinity,
                redirectFrom: [],
                search: { terms: [] },
            },
            body: content,
            outline: [],
            format: "json",
            tags: [],
            template: "default",
            fileInfo: {
                path: "./nav",
                name: "foo",
                fullPath: "docs/nav/foo.json",
                outputName: false,
            },
        });
    });

    it("should use short-title if present", () => {
        expect.assertions(1);
        const content = JSON.stringify({
            title: "My title",
            "short-title": "Short",
            href: "/foo",
        });
        const page = parseFile("docs/foo.json", "docs", content);
        expect(page.attributes.shortTitle).toBe("Short");
    });

    it("should use sortorder if present", () => {
        expect.assertions(1);
        const content = JSON.stringify({
            title: "My title",
            href: "/foo",
            sortorder: 3,
        });
        const page = parseFile("docs/foo.json", "docs", content);
        expect(page.attributes.sortorder).toBe(3);
    });
});
