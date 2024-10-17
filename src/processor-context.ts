import { type ResourceTask } from "./assets";
import { type Document } from "./document";
import { type NavigationSection } from "./navigation";
import { type VendorAsset } from "./vendor";

/**
 * @public
 */
/* eslint-disable-next-line @typescript-eslint/no-empty-object-type -- augmeted by other modules */
export interface TemplateData {
    /* augmented by processors */
}

/**
 * Template block renderer.
 *
 * - If you pass a filename the filename will be rendered with the templating engine.
 * - If you pass a function the returned markup will be injected into the rendered template.
 *
 * @public
 */
export type TemplateBlockRenderer<T> =
    | { filename: string; data?: T }
    | { render(): string };

/**
 * @internal
 */
export interface TemplateBlockData<T> {
    container: string;
    id: string;
    renderer: TemplateBlockRenderer<T>;
}

/**
 * @public
 */
export interface ProcessorContext {
    readonly docs: Document[];
    readonly vendors: VendorAsset[];
    readonly topnav: NavigationSection;
    readonly sidenav: NavigationSection;
    readonly resources: ResourceTask[];
    readonly outputFolder: string;

    addDocument(document: Document | Document[]): void;
    addVendorAsset(asset: VendorAsset | VendorAsset[]): void;

    /**
     * Add a new resource asset to be copied.
     *
     * @param dst - Destination directory relative to asset folder.
     * @param src - File or directory to copy.
     */
    addResource(dst: string, src: string): void;

    /**
     * Add a new block to be rendered in the template.
     *
     * @param container - The template container to add the block to. The
     * container must exist in the template or nothing will be rendered.
     * @param id - A unique identifier for this block.
     * @param renderer - Describes how to render the block content.
     */
    addTemplateBlock<T>(
        container: string,
        id: string,
        renderer: TemplateBlockRenderer<T>,
    ): void;

    /**
     * @internal
     */
    getAllTemplateBlocks(): Map<string, Array<TemplateBlockData<unknown>>>;

    /**
     * Tests if a template with name is present.
     *
     * @internal
     */
    hasTemplate(name: string): boolean;

    setTopNavigation(root: NavigationSection): void;
    setSideNavigation(root: NavigationSection): void;

    getAllTemplateData(): Record<string, unknown>;

    getTemplateData<K extends keyof TemplateData>(
        key: K,
    ): TemplateData[K] | undefined;
    getTemplateData(key: string): unknown;

    setTemplateData<K extends keyof TemplateData>(
        key: string,
        value: TemplateData[K],
    ): void;
    setTemplateData(key: string, value: unknown): void;

    log<TArgs extends unknown[]>(...args: TArgs): void;
}
