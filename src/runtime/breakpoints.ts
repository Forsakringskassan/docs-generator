const style = getComputedStyle(document.documentElement);

export const BREAKPOINT_SMALL = style.getPropertyValue("--docs-breakpoint-sm");
export const BREAKPOINT_MEDIUM = style.getPropertyValue("--docs-breakpoint-md");
export const BREAKPOINT_LARGE = style.getPropertyValue("--docs-breakpoint-lg");
