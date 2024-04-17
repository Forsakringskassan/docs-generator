import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import fse from "fs-extra";
import {
    type CompileOptions,
    type CSSAsset,
    type JSAsset,
    type ResourceTask,
    cssAssetProcessor,
    jsAssetProcessor,
    staticResourcesProcessor,
} from "./assets";
import { type SourceFiles, fileReaderProcessor } from "./file-reader";
import { nunjucksProcessor } from "./render";
import { type Document } from "./document";
import { type NavigationSection, navigationProcessor } from "./navigation";
import {
    type VendorAsset,
    type VendorDefinition,
    vendorProcessor,
} from "./vendor";
import { Processor, ProcessorStage } from "./processor";
import { ProcessorContext, TemplateBlockData } from "./processor-context";
import { serve } from "./serve";

export { type CompileOptions, type ResourceTask } from "./assets";
export {
    type Document,
    type DocumentBadge,
    type FileInfo,
    type NormalizedDocumentAttributes,
} from "./document";
export {
    type DocumentOutline,
    type DocumentOutlineEntry,
} from "./document-outline";
export {
    type FileReader,
    type SourceFiles,
    frontMatterFileReader,
    navigationFileReader,
    vueFileReader,
} from "./file-reader";
export { type MatomoOptions, matomoProcessor } from "./matomo";
export {
    type NavigationNode,
    type NavigationLeaf,
    type NavigationSection,
} from "./navigation";
export {
    type Processor,
    type ProcessorDescriptor,
    type ProcessorHandler,
    type ProcessorHook,
    type ProcessorOptions,
    type ProcessorStage,
} from "./processor";
export {
    selectableVersionProcessor,
    themeSelectProcessor,
    versionBannerProcessor,
    versionProcessor,
} from "./processors";
export {
    type ProcessorContext,
    type TemplateBlockData,
    type TemplateBlockRenderer,
    type TemplateData,
} from "./processor-context";
export { searchProcessor } from "./search";
export { type SetupOptions } from "./setup-options";
export {
    type VendorAsset,
    type VendorDefinition,
    type VendorDefinitionDescriptor,
} from "./vendor";
export { livereloadProcessor } from "./serve";
export { type AttributeTable, type AttributeValue } from "./utils";

/**
 * @public
 */
export interface GeneratorSiteOptions {
    /** Site name */
    name: string;

    /** Site languange (BCP-47, e.g. `en` or `sv`), default `en` */
    lang?: string;
}

/**
 * @public
 */
export interface GeneratorOptions {
    /** Site options */
    site: GeneratorSiteOptions;

    outputFolder: string;
    cacheFolder: string;

    /** List of folders to search when locating examples (searched recursively) */
    exampleFolders: string[];

    /** List of folders to search when locating templates. */
    templateFolders?: string[];

    /** List of extra processors to run */
    processors?: Processor[];

    /** List of vendor assets to compile */
    vendor?: VendorDefinition[];

    /** Path to file with exported `setup` function, responsible for mounting of component.
     * `function setup(options: { rootComponent: string, selector: string }): void`
     */
    setupPath: string;
}

function toArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}

function filterProcessors(
    stage: ProcessorStage,
    processors: Processor[],
): Processor[] {
    const before: Processor[] = [];
    const during: Processor[] = [];
    const after: Processor[] = [];
    for (const processor of processors) {
        if (processor.enabled === false) {
            continue;
        }
        if (processor.before === stage) {
            before.push(processor);
        }
        if (processor.stage === stage) {
            during.push(processor);
        }
        if (processor.after === stage) {
            after.push(processor);
        }
    }
    return [...before, ...during, ...after];
}

/* eslint-disable no-console -- expected to log */
async function stage(
    stage: ProcessorStage,
    context: Omit<ProcessorContext, "log">,
    processors: Processor[],
): Promise<string[]> {
    console.log(`stage:${stage}`);
    let generatedFiles: string[] = [];
    const filteredProcessors = filterProcessors(stage, processors);
    for (let i = 0; i < filteredProcessors.length; i++) {
        const processor = filteredProcessors[i];
        const isLast = i === filteredProcessors.length - 1;
        console.log(isLast ? "  └─" : "  ├─", processor.name);
        try {
            const result = await processor.handler({
                ...context,
                log(...args: unknown[]) {
                    console.log(isLast ? "      " : "  │   ", ...args);
                },
            });
            if (result) {
                generatedFiles = [...generatedFiles, ...result];
            }
        } catch (err) {
            console.error(`When running processor "${processor.name}":`);
            console.error(err);
            throw err;
        }
    }
    return generatedFiles;
}
/* eslint-enable no-console */

function createContext(): Omit<ProcessorContext, "log"> {
    let docs: Document[] = [];
    let vendors: VendorAsset[] = [];
    const resources: ResourceTask[] = [];
    const templateBlocks = new Map<string, TemplateBlockData[]>();
    let topnav: NavigationSection = {
        key: ".",
        title: "",
        path: "",
        sortorder: Infinity,
        children: [],
    };
    let sidenav: NavigationSection = {
        key: ".",
        title: "",
        path: "",
        sortorder: Infinity,
        children: [],
    };
    const templateData: Record<string, unknown> = {};
    return {
        get docs(): Document[] {
            return docs;
        },

        get vendors(): VendorAsset[] {
            return vendors;
        },

        get resources(): ResourceTask[] {
            return resources;
        },

        get topnav(): NavigationSection {
            return topnav;
        },

        get sidenav(): NavigationSection {
            return sidenav;
        },

        addDocument(document: Document | Document[]) {
            docs = [...docs, ...toArray(document)];
        },

        addVendorAsset(asset: VendorAsset | VendorAsset[]) {
            vendors = [...vendors, ...toArray(asset)];
        },

        addResource(dst: string, src: string): void {
            resources.push({
                from: src.replace(/\\/g, "/"),
                to: dst,
            });
        },

        addTemplateBlock(container, id, renderer): void {
            const block: TemplateBlockData = {
                container,
                id,
                renderer,
            };
            const list = templateBlocks.get(container) ?? [];
            templateBlocks.set(container, [...list, block]);
        },

        getAllTemplateBlocks(): Map<string, TemplateBlockData[]> {
            return templateBlocks;
        },

        setTopNavigation(root: NavigationSection) {
            topnav = root;
        },

        setSideNavigation(root: NavigationSection) {
            sidenav = root;
        },

        getAllTemplateData() {
            return templateData;
        },

        getTemplateData(key: string): unknown {
            return templateData[key];
        },

        setTemplateData(key: string, value: unknown) {
            templateData[key] = value;
        },
    };
}

/**
 * @public
 */
export class Generator {
    private site: GeneratorSiteOptions;
    private outputFolder: string;
    private cacheFolder: string;
    private assetFolder: string;
    private exampleFolders: string[];
    private templateFolders: string[];
    private processors: Processor[];
    private vendor: VendorDefinition[];
    private setupPath: string;
    private scripts: JSAsset[];
    private styles: CSSAsset[];
    private resources: ResourceTask[];
    private sourceFiles: SourceFiles[];

    public constructor(options: GeneratorOptions) {
        if (typeof options.site === "undefined") {
            throw new Error("site metadata not set in configuration");
        }

        this.site = options.site;
        this.outputFolder = options.outputFolder;
        this.cacheFolder = options.cacheFolder;
        this.assetFolder = path.posix.join(options.outputFolder, "assets");
        this.exampleFolders = options.exampleFolders;
        this.templateFolders = options.templateFolders ?? [];
        this.processors = options.processors ?? [];
        this.vendor = options.vendor ?? [];
        this.setupPath = options.setupPath.replace(/\\/g, "/");
        this.scripts = [];
        this.styles = [];
        this.resources = [];
        this.sourceFiles = [];
    }

    public compileScript(
        name: string,
        src: string | string[],
        options?: Partial<CompileOptions>,
    ): void {
        this.scripts.push({
            name,
            src,
            options: {
                appendTo: "none",
                attributes: {},
                ...options,
            },
        });
    }

    public compileStyle(
        name: string,
        src: string,
        options?: Partial<CompileOptions>,
    ): void {
        this.styles.push({
            name,
            src,
            options: {
                appendTo: "none",
                attributes: {},
                ...options,
            },
        });
    }

    /**
     * @param dst - Destination directory relative to asset folder.
     * @param src - File or directory to copy.
     */
    public copyResource(dst: string, src: string): void {
        this.resources.push({
            from: src.replace(/\\/g, "/"),
            to: dst,
        });
    }

    public async build(sourceFiles: SourceFiles[]): Promise<string[]> {
        this.sourceFiles = sourceFiles;
        const {
            site,
            outputFolder,
            cacheFolder,
            assetFolder,
            exampleFolders,
            templateFolders,
            setupPath,
        } = this;

        await this._prepareFolders();

        const processors: Processor[] = [
            fileReaderProcessor(sourceFiles),
            vendorProcessor(assetFolder, this.vendor),
            cssAssetProcessor(assetFolder, this.styles),
            jsAssetProcessor(assetFolder, this.scripts),
            staticResourcesProcessor(assetFolder, this.resources),
            navigationProcessor(),
            nunjucksProcessor({
                site: {
                    lang: "en",
                    ...site,
                },
                outputFolder,
                cacheFolder,
                exampleFolders,
                templateFolders,
                setupPath,
            }),
            ...this.processors,
        ];

        const context = createContext();
        const generatedFiles = [
            await stage("generate-docs", context, processors),
            await stage("generate-nav", context, processors),
            await stage("assets", context, processors),
            await stage("render", context, processors),
        ];
        return generatedFiles.flat();
    }

    /**
     * Start a development server hosting the generated documentation.
     */
    public serve(): Promise<void> {
        const { outputFolder, sourceFiles } = this;
        const watch = sourceFiles.map((it) => it.include).flat();
        return serve({
            outputFolder,
            watch,
            rebuild: (_filePath: string[]) => {
                return this.build(sourceFiles);
            },
        });
    }

    private async _prepareFolders(): Promise<void> {
        const { outputFolder, cacheFolder, assetFolder } = this;
        await fs.rm(cacheFolder, { force: true, recursive: true });
        if (existsSync(outputFolder)) {
            await fs.mkdir(path.dirname(cacheFolder), { recursive: true });

            /* `fs.rename(..)` does not work on windows when subdirectories are
             * involved, these two operations are ofcourse much slower and not
             * atomic but better than crashing */
            await fse.copy(outputFolder, cacheFolder);
            await fs.rm(outputFolder, { recursive: true });
        }
        await fs.mkdir(outputFolder, { recursive: true });
        await fs.mkdir(assetFolder, { recursive: true });
        await fs.mkdir("temp", { recursive: true });
    }
}
