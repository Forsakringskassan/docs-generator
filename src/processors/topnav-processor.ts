import fs from "node:fs/promises";
import path from "node:path/posix";
import { type NavigationSection } from "../navigation";
import { type Processor } from "../processor";

/**
 * Single entry for a topnav item.
 *
 * @public
 */
export interface TopnavEntry {
    path: string;
    title: string;
}

/**
 * @internal for testing
 */
export function generateNavigation(
    entries: TopnavEntry[],
): Omit<NavigationSection, "title"> {
    const children = entries.map((it, index): NavigationSection => {
        const key = path.parse(it.path).name;
        return {
            key: key,
            sortorder: index,
            children: [],
            ...it,
        };
    });
    return {
        key: ".",
        path: "./index.html",
        sortorder: Infinity,
        children,
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
            const content = await fs.readFile(filename, "utf-8");
            const parsed = JSON.parse(content) as TopnavEntry[];
            const rootNode = generateNavigation(parsed);
            context.setTopNavigation({
                title,
                ...rootNode,
            });
        },
    };
}
