import { expect, it } from "vitest";
import { type NavigationSection } from "../navigation";
import { type TopnavEntry, generateNavigation } from "./topnav-processor";

it("should generate navigation nodes for each entry", () => {
    expect.assertions(1);
    const entries: TopnavEntry[] = [
        { path: "./foo", title: "Foo" },
        { path: "./bar", title: "Bar" },
    ];
    const navtree: NavigationSection = {
        key: ".",
        title: "",
        path: "",
        sortorder: Infinity,
        children: [],
        visible: true,
    };
    const rootNode = generateNavigation(entries, navtree);
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
    const navtree: NavigationSection = {
        key: ".",
        title: "",
        path: "",
        sortorder: Infinity,
        children: [],
        visible: true,
    };
    const rootNode = generateNavigation(entries, navtree);
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

it("should merge children with existing navigation items", () => {
    expect.assertions(1);
    const entries: TopnavEntry[] = [
        { path: "./foo", title: "Foo", sortorder: 0 },
        { path: "./bar", title: "Bar", sortorder: 2 },
    ];
    const navtree: NavigationSection = {
        key: ".",
        title: "",
        path: "",
        sortorder: Infinity,
        children: [
            {
                key: "foo",
                title: "Foo",
                path: "./old-foo",
                sortorder: 5,
                visible: false,
                children: [
                    {
                        title: "Foo Child",
                        path: "./foo-child",
                        sortorder: 0,
                        id: "foo-child",
                        external: false,
                    },
                ],
            },
            {
                key: "baz",
                title: "Baz",
                path: "./baz",
                sortorder: 1,
                visible: true,
                children: [],
            },
        ],
        visible: true,
    };

    const rootNode = generateNavigation(entries, navtree);
    expect(rootNode.children).toEqual([
        {
            key: "foo",
            title: "Foo",
            path: "./foo",
            sortorder: 0,
            visible: true,
            children: [
                {
                    title: "Foo Child",
                    path: "./foo-child",
                    sortorder: 0,
                    id: "foo-child",
                    external: false,
                },
            ],
        },
        {
            key: "bar",
            title: "Bar",
            path: "./bar",
            sortorder: 2,
            visible: true,
            children: [],
        },
    ]);
});

it("should handle new entries not present in existing navigation", () => {
    expect.assertions(1);
    const entries: TopnavEntry[] = [
        { path: "./new-entry", title: "New Entry", sortorder: 0 },
    ];
    const navtree: NavigationSection = {
        key: ".",
        title: "",
        path: "",
        sortorder: Infinity,
        children: [],
        visible: true,
    };

    const rootNode = generateNavigation(entries, navtree);
    expect(rootNode.children).toEqual([
        {
            key: "new-entry",
            title: "New Entry",
            path: "./new-entry",
            sortorder: 0,
            visible: true,
            children: [],
        },
    ]);
});
