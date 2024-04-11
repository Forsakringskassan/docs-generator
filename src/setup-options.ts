import { type Component } from "vue";

/**
 * Options passed from the example compiler to the `setup` function.
 *
 * @public
 */
export interface SetupOptions {
    /** The example component expected to be mounted by the application */
    rootComponent: Component;

    /** Where the example should be mounted */
    selector: string;
}
