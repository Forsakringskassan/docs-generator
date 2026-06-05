import { isDocumentPage } from "../document";
import { type Processor } from "../processor";
import { generateNavtree } from "./generate-navtree";
import { sortNavigationTree } from "./sort-navigation-tree";

export function navigationProcessor(): Processor {
    return {
        stage: "generate-nav",
        name: "navigation-processor",
        handler(context) {
            const pages = context.docs.filter(isDocumentPage);
            const navtree = generateNavtree(pages);
            sortNavigationTree(navtree);
            context.setTopNavigation(navtree);
            context.setSideNavigation(navtree);
        },
    };
}
