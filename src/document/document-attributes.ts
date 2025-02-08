/**
 * @public
 */
export type DocumentBadge = "success" | "error" | "info";

/**
 * @public
 */
export interface ComponentAttribute {
    /** component name */
    name: string;
    /** optional hint (glob pattern) how to find the component */
    source?: string;
}

/**
 * @internal
 */
export interface DocumentAttributes {
    /** Page title */
    title?: string;

    /** Short page title (e.g. used in sidenav) */
    "short-title"?: string;

    /** Page layout */
    layout?: string;

    /** sets the `name` property in `Document` */
    name?: string;

    /** document alias for easier linking */
    alias?: string | string[];

    /** component status */
    status?: string;

    /** visible in navigation */
    visible?: boolean;

    /** if should write to file and make available as a page */
    include?: boolean;

    /** component(s) this page corresponds to */
    component?:
        | string
        | ComponentAttribute
        | Array<string | ComponentAttribute>;

    /** link to external page in navigation */
    href?: string;

    /** navigation sortorder */
    sortorder?: number;

    /** pages redirecting to this page */
    redirect_from?: string | string[];
}

/**
 * @public
 */
export interface NormalizedDocumentAttributes {
    title?: string;
    shortTitle?: string;
    layout?: string;
    status?: string;
    badge?: DocumentBadge;
    component?: ComponentAttribute[];
    href?: string;
    /** normalized sortorder (defaults to Infinity) */
    sortorder: number;
    redirectFrom: string[];
}

/**
 * @internal
 */
export const documentAttributeKeys = [
    "title",
    "short-title",
    "layout",
    "name",
    "alias",
    "status",
    "visible",
    "include",
    "component",
    "href",
    "sortorder",
    "redirect_from",
];
