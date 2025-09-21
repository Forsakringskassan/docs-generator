import path from "node:path";
import { type DocumentPage } from "../document";

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
    readonly visible: boolean;
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

function pathFromDoc({ fileInfo }: DocumentPage): [string, boolean] {
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

export function generateNavtree(docs: DocumentPage[]): NavigationSection {
    /** Lookup table for sections */
    const section: Record<string, MutableNavigationSection> = {};

    function createSection(
        key: string,
        title: string,
        sortorder: number,
        { visible }: { visible?: boolean } = {},
    ): void {
        const existing = section[key] as MutableNavigationSection | undefined;
        if (existing) {
            existing.title = title;
            existing.sortorder = sortorder;
            existing.visible = visible ?? true;
        } else {
            const node: MutableNavigationSection = {
                key,
                title,
                path: "",
                sortorder,
                children: [],
                visible: visible ?? true,
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
        let parent = section[parentKey] as MutableNavigationSection | undefined;

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
            visible: true,
        };
        section[parentKey] = parent;
        let anchestor = parentKey;
        let current = parent;
        while (anchestor !== ".") {
            anchestor = getParentKey(anchestor);
            if (section[anchestor] as MutableNavigationSection | undefined) {
                section[anchestor].children.push(current);
                break;
            }
            const node: MutableNavigationSection = {
                key: anchestor,
                title: "",
                path: "",
                sortorder: Infinity,
                children: [current],
                visible: true,
            };
            section[anchestor] = node;
            current = node;
        }

        return parent;
    }

    for (const doc of docs) {
        /* always ignore redirects, should never be present in navigation no
         * matter what */
        if (doc.format === "redirect") {
            continue;
        }

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
                createSection(name, title, sortorder, { visible: false });
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

            const existing = section[name] as
                | MutableNavigationSection
                | undefined;
            if (existing) {
                existing.title = title;
                existing.path = leafNode.path;
                existing.sortorder = sortorder;
                existing.children.unshift(leafNode);
                existing.visible = true;
            } else {
                const sectionNode: MutableNavigationSection = {
                    key: name,
                    title,
                    path: leafNode.path,
                    sortorder,
                    children: [leafNode],
                    visible: true,
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

    const root = section["."] as MutableNavigationSection | undefined;
    if (root) {
        return root;
    } else {
        return {
            key: ".",
            title: "",
            path: "",
            sortorder: Infinity,
            children: [],
            visible: true,
        };
    }
}
