import { Processor } from "../processor";
import { generateNavtree } from "./generate-navtree";

export function navigationProcessor(): Processor {
    return {
        stage: "generate-nav",
        name: "navigation-processor",
        handler(context) {
            const navtree = generateNavtree(context.docs);
            context.setTopNavigation(navtree);
            context.setSideNavigation(navtree);
        },
    };
}
