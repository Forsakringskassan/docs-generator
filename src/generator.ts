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
import { compileProcessorRuntime } from "./compile-processor-runtime";
import { type SourceFiles, fileReaderProcessor } from "./file-reader";
import { nunjucksProcessor, TemplateLoader } from "./render";
import { type Document } from "./document";
import { manifestPageFromDocument } from "./manifest";
import { type NavigationSection, navigationProcessor } from "./navigation";
import {
    type VendorAsset,
    type VendorDefinition,
    vendorProcessor,
} from "./vendor";
import { type Processor } from "./processor";
import {
    type ProcessorContext,
    type TemplateBlockData,
} from "./processor-context";
import { type ProcessorStage } from "./processor-stage";
import { type Manifest } from "./manifest";
import { serve } from "./serve";
import { haveOutput } from "./utils";
import { createTemplateLoader } from "./render/render";

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

    /** List of folders to search when locating examples (searched recursively). Default: `[]` */
    exampleFolders?: string[];

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

    /**
     * Options for markdown renderer.
     */
    markdown?: {
        /**
         * Options for markdown messagebox container.
         */
        messagebox?: {
            /**
             * Default titles for messageboxes.
             *
             * If a title is the empty string `""` the usage of title is
             * disabled by default.
             *
             * @example
             * ```json
             * {
             *   "title": {
             *     "info": "Information",
             *     "tip": "Tips",
             *     "warning": "Varning",
             *     "danger": "Se upp!"
             *   }
             * }
             * ```
             */
            title?: Record<string, string>;
        };
    };
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
    { verbose }: { verbose: boolean } = { verbose: true },
): Promise<string[]> {
    if (verbose) {
        console.log(`stage:${stage}`);
    }
    let generatedFiles: string[] = [];
    const filteredProcessors = filterProcessors(stage, processors);
    for (let i = 0; i < filteredProcessors.length; i++) {
        const processor = filteredProcessors[i];
        const isLast = i === filteredProcessors.length - 1;
        if (verbose) {
            console.log(isLast ? "  └─" : "  ├─", processor.name);
        }
        try {
            const result = await processor.handler({
                ...context,
                log(...args: unknown[]) {
                    if (verbose) {
                        console.log(isLast ? "      " : "  │   ", ...args);
                    }
                },
            });
            if (result) {
                generatedFiles = [...generatedFiles, ...result];
            }
        } catch (err) {
            console.error(`When running processor "${processor.name}":`);
            throw err;
        }
    }
    return generatedFiles;
}
/* eslint-enable no-console */

function createContext(
    templateLoader: TemplateLoader,
): Omit<ProcessorContext, "log"> {
    let docs: Document[] = [];
    let vendors: VendorAsset[] = [];
    const resources: ResourceTask[] = [];
    const templateBlocks = new Map<string, Array<TemplateBlockData<unknown>>>();
    let topnav: NavigationSection = {
        key: ".",
        title: "",
        path: "",
        sortorder: Infinity,
        children: [],
        visible: true,
    };
    let sidenav: NavigationSection = {
        key: ".",
        title: "",
        path: "",
        sortorder: Infinity,
        children: [],
        visible: true,
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
            const block: TemplateBlockData<unknown> = {
                container,
                id,
                renderer,
            };
            const list = templateBlocks.get(container) ?? [];
            templateBlocks.set(container, [...list, block]);
        },

        getAllTemplateBlocks(): Map<string, Array<TemplateBlockData<unknown>>> {
            return templateBlocks;
        },

        hasTemplate(name: string): boolean {
            return Boolean(templateLoader?.hasTemplate(name));
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
        this.exampleFolders = options.exampleFolders ?? [];
        this.templateFolders = options.templateFolders ?? [];
        this.processors = options.processors ?? [];
        this.vendor = options.vendor ?? [];
        this.setupPath = options.setupPath.replace(/\\/g, "/");
        this.scripts = [];
        this.styles = [];
        this.resources = [];
        this.sourceFiles = [];

        const bootstrapUrl = new URL("runtime-bootstrap.js", import.meta.url);
        this.compileScript("bootstrap", bootstrapUrl, {
            appendTo: "head",
            priority: 100,
        });
    }

    public compileScript(
        name: string,
        src: string | URL,
        options?: Partial<CompileOptions>,
        buildOptions?: { define?: Record<string, string> },
    ): void {
        this.scripts.push({
            name,
            src,
            options: {
                appendTo: "none",
                attributes: {},
                priority: 0,
                ...options,
            },
            buildOptions: {
                ...buildOptions,
            },
        });
    }

    public compileStyle(
        name: string,
        src: string | URL,
        options?: Partial<CompileOptions>,
    ): void {
        this.styles.push({
            name,
            src,
            options: {
                appendTo: "none",
                attributes: {},
                priority: 0,
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

    /**
     * Generate a manifest listing all generated documents that will be present
     * in `outputFolder`.
     *
     * Note: this only collects documents from the `generate-docs` stage,
     * potential documents generated at later stages will not be present.
     *
     * @public
     */
    public async manifest(sourceFiles: SourceFiles[]): Promise<Manifest> {
        const processors: Processor[] = [
            fileReaderProcessor(sourceFiles),
            ...this.processors,
        ];

        const templateLoader = createTemplateLoader([]);
        const context = createContext(templateLoader);
        await stage("generate-docs", context, processors, { verbose: false });

        const docs = context.docs.filter(haveOutput);
        const pages = docs.map(manifestPageFromDocument);
        return { pages };
    }

    public async build(sourceFiles: SourceFiles[]): Promise<string[]> {
        const cwd = process.cwd();

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
            cssAssetProcessor(assetFolder, this.styles, { cwd }),
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
                markdown: {},
            }),
            ...this.processors,
        ];

        compileProcessorRuntime(this, import.meta.url, processors);

        const templateLoader = createTemplateLoader(templateFolders);
        const context = createContext(templateLoader);
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
