import { NavigationSection, isNavigationSection } from "./generate-navtree";

/**
 * @internal
 */
export function sortNavigationTree(tree: NavigationSection): void {
    tree.children.sort((a, b) => {
        if (a.sortorder < b.sortorder) {
            return -1;
        } else if (a.sortorder > b.sortorder) {
            return 1;
        }

        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
        if (titleA < titleB) {
            return -1;
        }
        if (titleA > titleB) {
            return 1;
        }
        return 0;
    });
    for (const child of tree.children) {
        if (isNavigationSection(child)) {
            sortNavigationTree(child);
        }
    }
}
