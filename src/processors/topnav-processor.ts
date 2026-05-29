import fs from "node:fs/promises";
import path from "node:path/posix";
import { isDocumentPage } from "../document";
import { type NavigationSection, sortNavigationTree } from "../navigation";
import { generateNavtree } from "../navigation/generate-navtree";
import { type Processor } from "../processor";

/**
 * Single entry for a topnav item.
 *
 * @public
 */
export interface TopnavEntry {
    path: string;
    title: string;
    sortorder?: number;
    visible?: boolean;
}

/**
 * @internal for testing
 */
export function generateNavigation(
    entries: TopnavEntry[],
    navtree: NavigationSection,
): Omit<NavigationSection, "title"> {
    return {
        key: ".",
        path: "./index.html",
        sortorder: Infinity,
        visible: true,
        children: entries
            .map((entry, index) => {
                // Find the corresponding item in navtree
                const navtreeItem = navtree.children.find(
                    (item) => item.title === entry.title,
                );

                if (navtreeItem) {
                    return {
                        ...navtreeItem,
                        path: entry.path,
                        sortorder: entry.sortorder ?? index,
                        visible: true,
                    };
                }

                const key = path.parse(entry.path).name;
                // Create a new NavigationLeaf for entries not in navtree
                return {
                    key,
                    sortorder: index,
                    children: [],
                    visible: true,
                    ...entry,
                };
            })
            .toSorted((a, b) => a.sortorder - b.sortorder),
    };
}

/**
 * Processor to create a manual topnav:
 *
 * - Custom order.
 * - Custom items.
 *
 * @public
 */
/* istanbul ignore next: not needed for coverage, the important part is tested from generateNavigation */
export function topnavProcessor(filename: string, title: string): Processor {
    return {
        after: "generate-nav",
        name: "topnav-processor",
        async handler(context) {
            const content = await fs.readFile(filename, "utf8");
            const parsed = JSON.parse(content) as TopnavEntry[];
            const pages = context.docs.filter(isDocumentPage);
            const navtree = generateNavtree(pages);
            sortNavigationTree(navtree);
            const rootNode = generateNavigation(parsed, navtree);

            context.setTopNavigation({
                title,
                ...rootNode,
            });
        },
    };
}
