import { isDocumentPage } from "../document";
import { Processor } from "../processor";
import { generateNavtree } from "./generate-navtree";

export function navigationProcessor(): Processor {
    return {
        stage: "generate-nav",
        name: "navigation-processor",
        handler(context) {
            const pages = context.docs.filter(isDocumentPage);
            const navtree = generateNavtree(pages);
            context.setTopNavigation(navtree);
            context.setSideNavigation(navtree);
        },
    };
}
