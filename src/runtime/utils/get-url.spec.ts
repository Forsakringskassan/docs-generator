import path from "node:path";
import { type DocumentLike, getUrl } from "./get-url";

interface Entry {
    fromPath: string;
    toPath: string;
    expected: string;
}

const entries: Entry[] = [
    {
        fromPath: "/index.html",
        toPath: "data.json",
        expected: "./data.json",
    },
    {
        fromPath: "/index.html",
        toPath: "foo/data.json",
        expected: "./foo/data.json",
    },
    {
        fromPath: "/index.html",
        toPath: "../data.json",
        expected: "../data.json",
    },
    {
        fromPath: "/foo/bar.html",
        toPath: "data.json",
        expected: "../data.json",
    },
    {
        fromPath: "/foo/bar.html",
        toPath: "foo/data.json",
        expected: "../foo/data.json",
    },
    {
        fromPath: "/foo/bar.html",
        toPath: "../data.json",
        expected: "../../data.json",
    },
    {
        fromPath: "/foo/bar/baz.html",
        toPath: "data.json",
        expected: "../../data.json",
    },
];

function mockRootUrl(fromPath: string): string {
    const dir = path.dirname(fromPath).slice(1);
    if (dir !== "") {
        return dir
            .split("/")
            .map(() => "..")
            .join("/");
    } else {
        return ".";
    }
}

function mockDocument(fromPath: string): DocumentLike {
    return {
        documentElement: {
            dataset: {
                rootUrl: mockRootUrl(fromPath),
            },
        },
    };
}

it.each(entries)("should resolve url from $fromPath to $toPath", (entry) => {
    expect.assertions(1);
    const { fromPath, toPath, expected } = entry;
    const document = mockDocument(fromPath);
    const result = getUrl(document, toPath);
    expect(result).toBe(expected);
});
