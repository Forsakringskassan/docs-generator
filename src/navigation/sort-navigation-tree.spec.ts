import {
    type NavigationLeaf,
    type NavigationSection,
} from "./generate-navtree";
import { sortNavigationTree } from "./sort-navigation-tree";

function capitalize(value: string): string {
    return `${value[0].toUpperCase()}${value.slice(1)}`;
}

function mockLeaf(
    id: string,
    entry: Partial<NavigationLeaf> = {},
): NavigationLeaf {
    return {
        title: capitalize(id),
        path: `/${id}`,
        sortorder: Infinity,
        id,
        external: false,
        ...entry,
    };
}

it("should sort by manual sort order", () => {
    expect.assertions(1);
    const items: NavigationSection = {
        key: "root",
        title: "Root node",
        path: "/",
        sortorder: 0,
        children: [
            mockLeaf("a", {
                sortorder: 2,
            }),
            mockLeaf("b", {
                sortorder: 1,
            }),
            mockLeaf("c", {
                sortorder: 3,
            }),
        ],
        visible: true,
    };
    sortNavigationTree(items);
    expect(items.children).toEqual([
        expect.objectContaining({ id: "b" }),
        expect.objectContaining({ id: "a" }),
        expect.objectContaining({ id: "c" }),
    ]);
});

it("should sort entries with same sortorder by title", () => {
    expect.assertions(1);
    const items: NavigationSection = {
        key: "root",
        title: "Root node",
        path: "/",
        sortorder: 0,
        children: [
            mockLeaf("a", {
                sortorder: 1,
            }),
            mockLeaf("c", {
                sortorder: 1,
            }),
            mockLeaf("b", {
                sortorder: 1,
            }),
        ],
        visible: true,
    };
    sortNavigationTree(items);
    expect(items.children).toEqual([
        expect.objectContaining({ id: "a" }),
        expect.objectContaining({ id: "b" }),
        expect.objectContaining({ id: "c" }),
    ]);
});

it("should handle Infinity", () => {
    expect.assertions(1);
    const items: NavigationSection = {
        key: "root",
        title: "Root node",
        path: "/",
        sortorder: 0,
        children: [
            mockLeaf("a", {
                sortorder: Infinity,
            }),
            mockLeaf("c", {
                sortorder: Infinity,
            }),
            mockLeaf("b", {
                sortorder: 1,
            }),
        ],
        visible: true,
    };
    sortNavigationTree(items);
    expect(items.children).toEqual([
        expect.objectContaining({ id: "b" }),
        expect.objectContaining({ id: "a" }),
        expect.objectContaining({ id: "c" }),
    ]);
});
