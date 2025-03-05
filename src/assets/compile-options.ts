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
     * - `none` (default) - the asset is not injected (but is available in importmap)
     */
    appendTo: "none" | "head" | "body";

    /**
     * Extra attributes to include in the `<link>` or `<script>` tag.
     */
    attributes: AttributeTable;

    /**
     * Assets with higher priority is sorted and loaded earlier than assets with
     * lower.
     *
     * The builtin priorities:
     *
     * - Default is `0`.
     * - Processor runtime assets uses `50`.
     * - Bootstrap runtime uses `100`.
     */
    priority: number;
}
