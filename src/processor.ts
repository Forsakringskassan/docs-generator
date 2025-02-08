import { type ProcessorContext } from "./processor-context";
import { type ProcessorStage } from "./processor-stage";

/**
 * @public
 */
export interface ProcessorOptions {
    /** Enable/disable processor. Default: `true` */
    enabled?: boolean;
}

/**
 * Describes a runtime client script required by this processor.
 *
 * @public
 */
export interface ProcessorRuntime {
    /** Path (from repo root) to the script entrypoint */
    src: string;

    /** Bundle name (in dist/processors) folder (default: derived from processor name) */
    name?: string;

    /** Build options (passed to compileScript) */
    buildOptions?: {
        format?: "iife" | "cjs" | "esm";
        define?: Record<string, string>;
    };
}

/**
 * @public
 */
/* eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style -- technical debt */
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

    /**
     * Name of this processor. Only used for logging purposes.
     */
    name: string;

    enabled?: boolean;

    /** List of runtime client scripts required by this processor */
    runtime?: ProcessorRuntime[];

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
