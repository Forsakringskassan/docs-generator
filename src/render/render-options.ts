import { type i18n } from "i18next";
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
    i18n: i18n;
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

    /** A previously constructed fileMatcher() */
    fileMatcher(filename: string, context?: string): string;
}
