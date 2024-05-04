import { type TemplateBlockData } from "../processor-context";

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
    templateData: Record<string, unknown>;

    addResource(dst: string, src: string): void;
}
