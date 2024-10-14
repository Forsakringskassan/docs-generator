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
            visible: true,
        },
        {
            key: "bar",
            title: "Bar",
            path: "./bar",
            sortorder: 1,
            children: [],
            visible: true,
        },
    ]);
});

it("should override properties", () => {
    expect.assertions(1);
    const entries: TopnavEntry[] = [
        { path: "./foo", title: "Foo", sortorder: 1, visible: false },
    ];
    const rootNode = generateNavigation(entries);
    expect(rootNode.children).toEqual([
        {
            key: "foo",
            title: "Foo",
            path: "./foo",
            sortorder: 1,
            children: [],
            visible: false,
        },
    ]);
});
