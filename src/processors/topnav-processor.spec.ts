import { type TopnavEntry, generateNavigation } from "./topnav-processor";

it("should generate navigation nodes for each entry", () => {
    expect.assertions(1);
    const entries: TopnavEntry[] = [
        { path: "./foo", title: "Foo" },
        { path: "./bar", title: "Bar" },
    ];
    const rootNode = generateNavigation(entries);
    expect(rootNode.children).toEqual([
        {
            key: "foo",
            title: "Foo",
            path: "./foo",
            sortorder: 0,
            children: [],
        },
        {
            key: "bar",
            title: "Bar",
            path: "./bar",
            sortorder: 1,
            children: [],
        },
    ]);
});
