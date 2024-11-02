import path from "node:path";
import { glob } from "glob";
import { type Document } from "../document";
import { frontMatterFileReader } from "../file-reader";
import { generateNavtree } from "./generate-navtree";
import { sortNavigationTree } from "./sort-navigation-tree";

function createDocument(
    filePath: string,
    title: string,
    doc?: Partial<Document>,
): Document {
    const parsed = path.parse(filePath);
    return {
        id: `mock:${filePath}`,
        name: path.basename(filePath),
        alias: [],
        visible: true,
        body: "",
        outline: [],
        format: "markdown",
        tags: [],
        template: "mock",
        fileInfo: {
            path: parsed.dir !== "" ? `./${parsed.dir}` : ".",
            name: parsed.name,
            fullPath: filePath,
            outputName: `${parsed.name}.html`,
        },
        ...doc,
        attributes: {
            title,
            sortorder: Infinity /* sorting is tested separately */,
            ...doc?.attributes,
        },
    };
}

it("should create root node", () => {
    const nav = generateNavtree([]);
    expect(nav).toEqual({
        key: ".",
        title: "",
        path: "",
        sortorder: Infinity,
        visible: true,
        children: [],
    });
});

it("should merge root index.md to root node", () => {
    const nav = generateNavtree([createDocument("index.md", "Frontpage")]);
    expect(nav).toEqual({
        key: ".",
        title: "Frontpage",
        path: "",
        sortorder: Infinity,
        visible: true,
        children: [],
    });
});

it("should store sort order from document", () => {
    const nav = generateNavtree([
        createDocument("index.md", "Frontpage", {
            attributes: { sortorder: 10 },
        }),
    ]);
    expect(nav).toEqual(
        expect.objectContaining({
            title: "Frontpage",
            sortorder: 10,
        }),
    );
});

it("should use short title if present", () => {
    const nav = generateNavtree([
        createDocument("index.md", "Frontpage", {
            attributes: { shortTitle: "Short", sortorder: Infinity },
        }),
    ]);
    expect(nav).toEqual(
        expect.objectContaining({
            title: "Short",
        }),
    );
});

it("should ignore documents with visible false", () => {
    const nav = generateNavtree([
        createDocument("index.md", "Frontpage"),
        createDocument("foo.md", "Foo", { visible: false }),
    ]);
    expect(nav).toEqual({
        key: ".",
        title: "Frontpage",
        path: "",
        sortorder: Infinity,
        children: [],
        visible: true,
    });
});

it("should not ignore sections with visible false", () => {
    const nav = generateNavtree([
        createDocument("index.md", "Frontpage"),
        createDocument("foo/index.md", "Foo", { visible: false }),
        createDocument("foo/bar.md", "Bar"),
    ]);
    expect(nav).toEqual({
        key: ".",
        title: "Frontpage",
        path: "",
        sortorder: Infinity,
        visible: true,
        children: [
            {
                key: "./foo",
                title: "Foo",
                path: "",
                sortorder: Infinity,
                visible: false,
                children: [
                    {
                        id: "mock:foo/bar.md",
                        title: "Bar",
                        path: "./foo/bar.html",
                        sortorder: Infinity,
                        external: false,
                    },
                ],
            },
        ],
    });
});

it("should create children for each folder", () => {
    const nav = generateNavtree([
        createDocument("index.md", "Frontpage"),
        createDocument("usage/index.md", "Usage guide"),
        createDocument("usage/foo.md", "Foo component"),
        createDocument("components/index.md", "Components", {
            attributes: { sortorder: 10 },
        }),
    ]);
    expect(nav).toEqual({
        key: ".",
        title: "Frontpage",
        path: "",
        sortorder: Infinity,
        visible: true,
        children: [
            {
                key: "./usage",
                title: "Usage guide",
                path: "./usage/",
                sortorder: Infinity,
                visible: true,
                children: [
                    {
                        id: "mock:usage/index.md",
                        title: "Usage guide",
                        path: "./usage/",
                        sortorder: Infinity,
                        external: false,
                    },
                    {
                        id: "mock:usage/foo.md",
                        title: "Foo component",
                        path: "./usage/foo.html",
                        sortorder: Infinity,
                        external: false,
                    },
                ],
            },
            {
                key: "./components",
                title: "Components",
                path: "./components/",
                sortorder: 10,
                visible: true,
                children: [
                    {
                        id: "mock:components/index.md",
                        path: "./components/",
                        title: "Components",
                        sortorder: 10,
                        external: false,
                    },
                ],
            },
        ],
    });
});

it("should create children for each folder (inverse order)", () => {
    const nav = generateNavtree([
        createDocument("components/index.md", "Components"),
        createDocument("usage/foo.md", "Foo component"),
        createDocument("usage/index.md", "Usage guide", {
            attributes: { sortorder: 20 },
        }),
        createDocument("index.md", "Frontpage", {
            attributes: { sortorder: 10 },
        }),
    ]);
    expect(nav).toEqual({
        key: ".",
        title: "Frontpage",
        path: "",
        sortorder: 10,
        visible: true,
        children: [
            {
                key: "./components",
                title: "Components",
                path: "./components/",
                sortorder: Infinity,
                visible: true,
                children: [
                    {
                        id: "mock:components/index.md",
                        path: "./components/",
                        title: "Components",
                        sortorder: Infinity,
                        external: false,
                    },
                ],
            },
            {
                key: "./usage",
                title: "Usage guide",
                path: "./usage/",
                sortorder: 20,
                visible: true,
                children: [
                    {
                        id: "mock:usage/index.md",
                        title: "Usage guide",
                        path: "./usage/",
                        sortorder: 20,
                        external: false,
                    },
                    {
                        id: "mock:usage/foo.md",
                        title: "Foo component",
                        path: "./usage/foo.html",
                        sortorder: Infinity,
                        external: false,
                    },
                ],
            },
        ],
    });
});

it("should create children for subpages", () => {
    const nav = generateNavtree([
        createDocument("index.md", "Frontpage"),
        createDocument("a/index.md", "A"),
        createDocument("a/foo.md", "A > Foo"),
        createDocument("a/bar.md", "A > Bar"),
        createDocument("b/index.md", "B"),
        createDocument("b/foo.md", "B > Foo"),
        createDocument("b/bar.md", "B > Bar"),
        createDocument("b/c/index.md", "B > C"),
        createDocument("b/c/foo.md", "B > C > Foo"),
        createDocument("b/c/bar.md", "B > C > Bar"),
    ]);
    expect(nav).toEqual({
        key: ".",
        title: "Frontpage",
        path: "",
        sortorder: Infinity,
        visible: true,
        children: [
            {
                key: "./a",
                title: "A",
                path: "./a/",
                sortorder: Infinity,
                visible: true,
                children: [
                    {
                        id: "mock:a/index.md",
                        path: "./a/",
                        sortorder: Infinity,
                        title: "A",
                        external: false,
                    },
                    {
                        id: "mock:a/foo.md",
                        path: "./a/foo.html",
                        sortorder: Infinity,
                        title: "A > Foo",
                        external: false,
                    },
                    {
                        id: "mock:a/bar.md",
                        path: "./a/bar.html",
                        sortorder: Infinity,
                        title: "A > Bar",
                        external: false,
                    },
                ],
            },
            {
                key: "./b",
                title: "B",
                path: "./b/",
                sortorder: Infinity,
                visible: true,
                children: [
                    {
                        id: "mock:b/index.md",
                        path: "./b/",
                        sortorder: Infinity,
                        title: "B",
                        external: false,
                    },
                    {
                        id: "mock:b/foo.md",
                        path: "./b/foo.html",
                        sortorder: Infinity,
                        title: "B > Foo",
                        external: false,
                    },
                    {
                        id: "mock:b/bar.md",
                        path: "./b/bar.html",
                        sortorder: Infinity,
                        title: "B > Bar",
                        external: false,
                    },
                    {
                        key: "./b/c",
                        title: "B > C",
                        path: "./b/c/",
                        sortorder: Infinity,
                        visible: true,
                        children: [
                            {
                                id: "mock:b/c/index.md",
                                path: "./b/c/",
                                sortorder: Infinity,
                                title: "B > C",
                                external: false,
                            },
                            {
                                id: "mock:b/c/foo.md",
                                path: "./b/c/foo.html",
                                sortorder: Infinity,
                                title: "B > C > Foo",
                                external: false,
                            },
                            {
                                id: "mock:b/c/bar.md",
                                path: "./b/c/bar.html",
                                sortorder: Infinity,
                                title: "B > C > Bar",
                                external: false,
                            },
                        ],
                    },
                ],
            },
        ],
    });
});

it("should read title and sortorder from hidden index.md", () => {
    const nav = generateNavtree([
        createDocument("usage/index.md", "Usage guide", {
            visible: false,
            attributes: { sortorder: 10 },
        }),
        createDocument("usage/foo.md", "Foo component"),
    ]);
    expect(nav).toEqual({
        key: ".",
        title: ".",
        path: "",
        sortorder: Infinity,
        visible: true,
        children: [
            {
                key: "./usage",
                title: "Usage guide",
                path: "",
                sortorder: 10,
                visible: false,
                children: [
                    {
                        id: "mock:usage/foo.md",
                        title: "Foo component",
                        path: "./usage/foo.html",
                        sortorder: Infinity,
                        external: false,
                    },
                ],
            },
        ],
    });
});

async function getDocsFromGlob(
    pattern: string,
    basePath: string,
): Promise<Document[]> {
    const filenames = await glob(pattern, {
        ignore: "./docs/node_modules/**",
        nodir: true,
    });
    const parsed = filenames.map((it) => frontMatterFileReader(it, basePath));
    return (await Promise.all(parsed)).flat();
}

it("smoketest", async () => {
    const docs = await getDocsFromGlob("./docs/**/*.md", "./docs");
    const nav = generateNavtree(docs);
    sortNavigationTree(nav); // to prevent flakyness
    expect(nav).toMatchSnapshot();
});
