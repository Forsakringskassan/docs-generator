import {
    type TemplateBlockData,
    type TemplateData,
} from "../processor-context";

/**
 * @internal
 */
export interface RenderOptions {
    site: {
        name: string;
        lang: string;
    };
    outputFolder: string;
    cacheFolder: string;
    exampleFolders: string[];
    templateFolders: string[];
    setupPath: string;
    templateBlocks: Map<string, Array<TemplateBlockData<unknown>>>;
    templateData: TemplateData & Record<string, unknown>;

    markdown: {
        messagebox?: {
            title?: Record<string, string>;
        };
    };

    addResource(dst: string, src: string): void;
}
