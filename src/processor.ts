import { type ProcessorContext } from "./processor-context";

/**
 * @public
 */
export interface ProcessorOptions {
    /** Enable/disable processor. Default: `true` */
    enabled?: boolean;
}

/**
 * @public
 */
export type ProcessorStage =
    | "generate-docs"
    | "generate-nav"
    | "assets"
    | "render";

/**
 * @public
 */
export type ProcessorHook<K extends "before" | "stage" | "after"> = {
    [k in K]: ProcessorStage;
};

/**
 * @public
 */
export interface ProcessorHandler {
    before?: ProcessorStage;
    stage?: ProcessorStage;
    after?: ProcessorStage;
    name: string;
    enabled?: boolean;

    handler(
        context: ProcessorContext,
        /* eslint-disable-next-line @typescript-eslint/no-invalid-void-type --
         * technical debt: want implicit undefined (void) instead of explicit "return undefined" */
    ): void | string[] | Promise<void> | Promise<string[]>;
}

/**
 * @public
 */
export type ProcessorDescriptor<K extends "before" | "stage" | "after"> =
    ProcessorHook<K> & ProcessorHandler;

/**
 * @public
 */
export type Processor =
    | ProcessorDescriptor<"before">
    | ProcessorDescriptor<"stage">
    | ProcessorDescriptor<"after">;
