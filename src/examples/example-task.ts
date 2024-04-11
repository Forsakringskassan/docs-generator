/**
 * Task data shared between main process and worker.
 *
 * @public
 */
export interface ExampleCompileTask {
    /** output filename (without path) */
    outputFile: string;

    /** example sourcecode */
    sourcecode: string;

    /** original path to file containing example source */
    sourceFile: string;

    /** absolute path to document containing this example */
    parent: string;
}

/**
 * Task data for standalone example.
 */
export interface ExampleStandaloneTask {
    /** output filename (without path) */
    outputFile: string;

    /** example markup */
    content: string;
}

export interface ExampleBatch {
    /** directory where output files will be written */
    outputFolder: string;

    /** external libraries */
    external: string[];

    /** jobs to compile in this batch */
    tasks: ExampleCompileTask[];
}
