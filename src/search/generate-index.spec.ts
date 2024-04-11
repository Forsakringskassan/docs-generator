import { generateIndex } from "./generate-index";
import { type SearchEntry } from "./search-entry";

const entries: SearchEntry[] = [
    { url: "a.html", title: "A", words: ["Foo", "Bar"] },
    { url: "b.html", title: "B", words: ["Baz"] },
    { url: "c.html", title: "C", words: ["Spam", "Ham"] },
];

it("should generate list of all terms", () => {
    expect.assertions(1);
    const index = generateIndex(entries);
    expect(index.terms).toEqual(["Foo", "Bar", "Baz", "Spam", "Ham"]);
});

it("should generate list of all results", () => {
    expect.assertions(1);
    const index = generateIndex(entries);
    expect(index.results).toEqual([
        { url: "a.html", title: "A" },
        { url: "b.html", title: "B" },
        { url: "c.html", title: "C" },
    ]);
});

it("should generate mapping between terms and results", () => {
    expect.assertions(1);
    const { terms, mapping } = generateIndex(entries);
    expect(mapping).toEqual({
        [terms.indexOf("Foo")]: 0,
        [terms.indexOf("Bar")]: 0,
        [terms.indexOf("Baz")]: 1,
        [terms.indexOf("Spam")]: 2,
        [terms.indexOf("Ham")]: 2,
    });
});
