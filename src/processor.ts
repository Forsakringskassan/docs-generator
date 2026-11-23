import { type LinkResolver } from "./link-resolver";
import { type ProcessorContext } from "./processor-context";
import { type ProcessorStage } from "./processor-stage";

/**
 * @public
 */
export interface ProcessorOptions {
    /** Enable/disable processor. Default: `true` */
    readonly enabled?: boolean;
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
 * A dependency target: either a virtual stage or another processor's name.
 *
 * @public
 */
// /* eslint-disable-next-line @typescript-eslint/ban-types -- allow string autocomplete with ProcessorStage */
export type ProcessorTarget = ProcessorStage | (string & {});

/**
 * @public
 */
export type ProcessorDependency = ProcessorTarget | ProcessorTarget[];

/**
 * @public
 */
export interface ProcessorHandler {
    /**
     * Name of this processor. Used for logging and `before`/`after` ordering.
     */
    name: string;

    enabled?: boolean;

    /**
     * @deprecated Use `before` and/or `after` instead.
     */
    stage?: ProcessorStage;

    /**
     * Run this processor before the given virtual stage(s) or processor(s).
     */
    before?: ProcessorDependency;

    /**
     * Run this processor after the given virtual stage(s) or processor(s).
     */
    after?: ProcessorDependency;

    /** List of runtime client scripts required by this processor */
    runtime?: ProcessorRuntime[];

    handler?(
        context: ProcessorContext,
        /* eslint-disable-next-line @typescript-eslint/no-invalid-void-type --
         * technical debt: want implicit undefined (void) instead of explicit "return undefined" */
    ): void | string[] | Promise<void> | Promise<string[]>;

    /**
     * Resolve a link from a `{@link ...}` tag.
     */
    resolveLink?: LinkResolver;
    /**
     * Glob patterns or folders to ignore when searching for example files.
     */
    ignoreExamples?: string[];
}

/**
 * @public
 */
export type Processor = ProcessorHandler;

/**
 * @public
 * @deprecated Use {@link Processor} instead.
 */
export type ProcessorDescriptor<K extends "before" | "stage" | "after"> =
    K extends string ? Processor : never;

/**
 * @public
 * @deprecated Use {@link Processor} instead.
 */
export type ProcessorHook<K extends "before" | "stage" | "after"> =
    K extends string ? Processor : never;
