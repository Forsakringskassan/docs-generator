import { type ExampleCompileTask } from "./example-task";

/**
 * Represents an example needing compilation.
 *
 * The actual compilation is deferred and can be executed by calling
 * `compile(..)`.
 *
 * @public
 */
export interface ExampleCompiledResult {
    /** Sourcecode of this example (original or imported) */
    source: string;
    /** Language of sourcecode (original or imported) */
    language: string;
    /** Associated comments from markdown */
    comments: string[];
    /** Tags */
    tags: string[];
    /** HTML markup to inject into document */
    markup: string;
    /** asset filename */
    output: string;
    /** enables running example live in the browser */
    runtime: true;
    /** task data for compiler */
    task: ExampleCompileTask;
}

/**
 * Represents an example with static code only, e.g plain HTML.
 *
 * @public
 */
export interface ExampleStaticResult {
    /** Sourcecode of this example (original or imported) */
    source: string;
    /** Language of sourcecode (original or imported) */
    language: string;
    /** Associated comments from markdown */
    comments: string[];
    /** Tags */
    tags: string[];
    /** HTML markup to inject into document */
    markup: string;
    /** asset filename */
    output: string | null;
    /** enables/disables running example live in the browser */
    runtime: boolean;
    /** task data for compiler */
    task: null;
}

/**
 * @public
 */
export type ExampleResult = ExampleCompiledResult | ExampleStaticResult;
