/**
 * @internal
 */
export interface ExampleOptions {
    /** example sourcecode */
    source: string;
    /** language the sourcecode is in or "auto" if unknown */
    language: string | "auto";
    /** absolute path to the filename with the example sourcecode */
    filename: string;
    /** absolute path to document containing this example */
    parent: string;
    /** absolute path to setup function */
    setupPath: string;
    /** list of folders to search when importing examples */
    exampleFolders: string[];
    /** Tags */
    tags: string[];
}
