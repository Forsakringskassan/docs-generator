import path from "node:path";
import { type Document } from "../document";

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * @public
 */
export interface NavigationLeaf {
    readonly title: string;
    readonly path: string;
    readonly sortorder: number;
    readonly id: string;
    readonly external: boolean;
}

/**
 * @public
 */
export interface NavigationSection {
    readonly key: string;
    readonly title: string;
    readonly path: string;
    readonly sortorder: number;
    readonly children: NavigationNode[];
}

/**
 * @public
 */
export type NavigationNode = NavigationLeaf | NavigationSection;

type MutableNavigationSection = Mutable<NavigationSection>;

/**
 * @public
 */
export function isNavigationSection(
    node: NavigationNode,
): node is NavigationSection {
    return "key" in node;
}

function pathFromDoc({ fileInfo }: Document): [string, boolean] {
    if (fileInfo.name === "index") {
        return [fileInfo.path.replace(/\\/g, "/"), true];
    } else {
        return [
            `./${path.join(fileInfo.path, fileInfo.name).replace(/\\/g, "/")}`,
            false,
        ];
    }
}

function getParentKey(name: string): string {
    return name.split("/").slice(0, -1).join("/");
}

export function generateNavtree(docs: Document[]): NavigationSection {
    /** Lookup table for sections */
    const section: Record<string, MutableNavigationSection> = {};

    function createSection(
        key: string,
        title: string,
        sortorder: number,
    ): void {
        const existing = section[key];
        if (existing) {
            existing.title = title;
            existing.sortorder = sortorder;
        } else {
            const node: NavigationSection = {
                key,
                title,
                path: "",
                sortorder,
                children: [],
            };
            section[key] = node;
            if (key !== ".") {
                const parent = attach(key);
                parent.children.push(node);
            }
        }
    }

    function attach(key: string): MutableNavigationSection {
        const parentKey = getParentKey(key);
        let parent = section[parentKey];

        /* parent exists and is attached */
        if (parent) {
            return parent;
        }

        /* create stub if the parent does not exist (yet) */
        parent = {
            key: parentKey,
            title: parentKey.split("/").at(-1) ?? "(missing title)",
            path: "",
            sortorder: Infinity,
            children: [],
        };
        section[parentKey] = parent;
        let anchestor = parentKey;
        let current = parent;
        while (anchestor !== ".") {
            anchestor = getParentKey(anchestor);
            if (section[anchestor]) {
                section[anchestor].children.push(current);
                break;
            }
            const node: NavigationSection = {
                key: anchestor,
                title: "",
                path: "",
                sortorder: Infinity,
                children: [current],
            };
            section[anchestor] = node;
            current = node;
        }

        return parent;
    }

    for (const doc of docs) {
        const [name, isSection] = pathFromDoc(doc);
        const title =
            doc.attributes.shortTitle ??
            doc.attributes.title ??
            doc.fileInfo.name;
        const sortorder = doc.attributes.sortorder;

        /* external link */
        if (doc.attributes.href) {
            const parent = attach(name);
            const leafNode: NavigationLeaf = {
                id: doc.id,
                title,
                path: doc.attributes.href,
                sortorder,
                external: true,
            };
            parent.children.push(leafNode);
            continue;
        }

        /* ignore documents without any output */
        if (!doc.fileInfo.outputName) {
            if (isSection) {
                createSection(name, title, sortorder);
            }
            continue;
        }

        /* ignore documents with are marked as not navigatable */
        if (!doc.visible) {
            if (isSection) {
                createSection(name, title, sortorder);
            }
            continue;
        }

        /* special case: create or update root node */
        if (name === ".") {
            createSection(name, title, sortorder);
            continue;
        }

        const parent = attach(name);

        if (isSection) {
            const leafNode: NavigationLeaf = {
                id: doc.id,
                title,
                path: `${name}/`,
                sortorder,
                external: false,
            };

            const existing = section[name];
            if (existing) {
                existing.title = title;
                existing.path = leafNode.path;
                existing.sortorder = sortorder;
                existing.children.unshift(leafNode);
            } else {
                const sectionNode: NavigationSection = {
                    key: name,
                    title,
                    path: leafNode.path,
                    sortorder,
                    children: [leafNode],
                };
                section[name] = sectionNode;
                parent.children.push(sectionNode);
            }
        } else {
            const leafNode: NavigationLeaf = {
                id: doc.id,
                title,
                path: `${doc.fileInfo.path}/${doc.fileInfo.outputName}`,
                sortorder,
                external: false,
            };
            parent.children.push(leafNode);
        }
    }

    const root = section["."];
    if (root) {
        return root;
    } else {
        return {
            key: ".",
            title: "",
            path: "",
            sortorder: Infinity,
            children: [],
        };
    }
}
