import { type AttributeTable } from "../utils";
/**
 * @public
 */
export interface CompileOptions {
    /**
     * Automatically inject this asset in the html template.
     *
     * - `head` - the asset is injected in `<head>`
     * - `body` - the asset is injected in `<body>`
     * - `none` (default) - the asset is not injected.
     */
    appendTo: "none" | "head" | "body";

    /**
     * Extra attributes to include in the `<link>` or `<script>` tag.
     */
    attributes: AttributeTable;
}
