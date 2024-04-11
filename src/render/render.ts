import fs from "node:fs/promises";
import { existsSync, copyFileSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { execa } from "execa";
import nunjucks, {
    type Callback,
    type ILoaderAsync,
    type LoaderSource,
} from "nunjucks";
import { type VendorAsset } from "../vendor";
import { type FileInfo, type Document } from "../document";
import {
    type ExampleBatch,
    generateExample,
    ExampleCompileTask,
    ExampleStandaloneTask,
} from "../examples";
import {
    type NavigationLeaf,
    type NavigationSection,
    type NavigationNode,
    isNavigationSection,
    sortNavigationTree,
} from "../navigation";
import { getOutputFilePath } from "../utils";
import { type RenderOptions } from "./render-options";
import { findTemplate } from "./find-template";
import { createMarkdownRenderer } from "./create-markdown-renderer";

interface ResolvedTemplate {
    filePath: string;
    content: string;
}

interface ActiveNavigationLeaf extends NavigationLeaf {
    active: boolean;
}

interface ActiveNavigationSection extends NavigationSection {
    active: boolean;
}

type ActiveNavigationNode = ActiveNavigationLeaf | ActiveNavigationSection;

class Loader implements ILoaderAsync {
    public readonly async = true as const;
    private readonly folders: string[];
    private readonly templateCache: Map<string, ResolvedTemplate>;

    public constructor(folders: string[]) {
        this.folders = [...folders, path.join(__dirname, "../templates")];
        this.templateCache = new Map();
    }

    public async getSource(
        name: string,
        callback: Callback<Error, LoaderSource>,
    ): Promise<void> {
        try {
            const { content, filePath } = await this.resolveTemplate(name);
            callback(null, {
                src: content,
                path: filePath,
                noCache: false,
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                callback(err, null);
            } else {
                callback(new Error(String(err)), null);
            }
        }
    }

    private async resolveTemplate(name: string): Promise<ResolvedTemplate> {
        const { templateCache, folders } = this;
        const cached = templateCache.get(name);
        if (cached) {
            return cached;
        }
        const searchPaths = folders.map((it) => path.join(it, name));
        const filePath = searchPaths.find((it) => existsSync(it));
        if (!filePath) {
            const searched = folders.map((it) => `  - "${it}"`).join("\n");
            const message = `Failed to resolve template "${name}", searched in:

${searched}

Make sure the name is correct and the template file exists in one of the listed directories.`;
            throw new Error(message);
        }
        const content = await fs.readFile(filePath, "utf-8");
        const resolved = { content, filePath };
        templateCache.set(name, resolved);
        return resolved;
    }
}

const scriptPath = path.join(__dirname, "compile-example.js");
let loader: Loader | null = null;

function haveOutputFile(
    fileInfo: FileInfo,
): fileInfo is FileInfo & { outputName: string } {
    return fileInfo.outputName !== false;
}

function isExternalUrl(url: string): boolean {
    return (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("//")
    );
}

function isAbsoluteUrl(url: string): boolean {
    return url.startsWith("/");
}

function fillActiveNavigation(
    doc: Document,
    node: NavigationSection,
): ActiveNavigationSection;
function fillActiveNavigation(
    doc: Document,
    node: NavigationLeaf,
): ActiveNavigationLeaf;
function fillActiveNavigation(
    doc: Document,
    node: NavigationNode,
): ActiveNavigationNode;
function fillActiveNavigation(
    doc: Document,
    node: NavigationNode,
): ActiveNavigationNode {
    if (isNavigationSection(node)) {
        const children = node.children.map((it) =>
            fillActiveNavigation(doc, it),
        );
        const active = children.some((it) => it.active);
        return {
            ...node,
            active,
            children,
        };
    } else {
        const active = doc.id === node.id;
        return {
            ...node,
            active,
        };
    }
}

function findSidenav(
    doc: Document,
    tree: NavigationSection,
): ActiveNavigationNode | undefined {
    const { path, name } = doc.fileInfo;
    const category = path === "." ? name : path.split("/")[1];
    const sidenav = tree.children
        .filter(isNavigationSection)
        .find((it) => it.key === `./${category}`);
    if (sidenav) {
        return fillActiveNavigation(doc, sidenav);
    }
}

function cache(
    cacheFolder: string,
    outputFolder: string,
): (it: { outputFile: string }) => boolean {
    return (it: { outputFile: string }) => {
        const cacheFile = path.join(cacheFolder, it.outputFile);
        const outputFile = path.join(outputFolder, it.outputFile);
        /* @todo technical debt: shame on me, doing side-effects in a filter function :( and not even async */
        if (existsSync(cacheFile)) {
            copyFileSync(cacheFile, outputFile);
            return false;
        } else {
            return true;
        }
    };
}

async function compileExamples(options: {
    fileInfo: FileInfo;
    cacheFolder: string;
    outputFolder: string;
    tasks: ExampleCompileTask[];
    vendors: VendorAsset[];
}): Promise<void> {
    const { fileInfo, tasks, vendors } = options;
    if (tasks.length === 0) {
        return;
    }

    const cacheFolder = path.posix.join(options.cacheFolder, fileInfo.path);
    const outputFolder = path.posix.join(options.outputFolder, fileInfo.path);
    const cacheMiss = cache(cacheFolder, outputFolder);
    const dirtyTasks = tasks.filter(cacheMiss);

    const batch: ExampleBatch = {
        outputFolder,
        external: vendors.map((it) => it.package),
        tasks: dirtyTasks,
    };
    const result = await execa("node", [scriptPath], {
        input: JSON.stringify(batch),
        all: true,
    });
    const hasOutput = result.all ? result.all.length > 0 : false;
    if (hasOutput) {
        /* eslint-disable-next-line no-console -- We don't want to hide how it went  */
        console.log(result.all);
    }
}

async function compileStandalones(options: {
    fileInfo: FileInfo;
    cacheFolder: string;
    outputFolder: string;
    tasks: ExampleStandaloneTask[];
    renderTemplate(name: string, context: object): Promise<string>;
    templateData: Record<string, unknown>;
}): Promise<void> {
    const { fileInfo, tasks, renderTemplate, templateData } = options;
    if (tasks.length === 0) {
        return;
    }

    const cacheFolder = path.posix.join(options.cacheFolder, fileInfo.path);
    const outputFolder = path.posix.join(options.outputFolder, fileInfo.path);
    const cacheMiss = cache(cacheFolder, outputFolder);
    const dirtyTasks = tasks.filter(cacheMiss);

    const standaloneTemplate = findTemplate(fileInfo, "example");
    for (const task of dirtyTasks) {
        const outputFile = path.join(outputFolder, task.outputFile);
        const content = await renderTemplate(standaloneTemplate, {
            ...templateData,
            content: task.content,
        });
        await fs.writeFile(outputFile, content, "utf-8");
    }
}

/**
 * @internal
 */
export function createTemplateLoader(folders: string[]): void {
    loader = new Loader(folders);
}

/**
 * @internal
 */
export async function render(
    doc: Document,
    docs: Document[],
    nav: { topnav: NavigationSection; sidenav: NavigationSection },
    vendors: VendorAsset[],
    options: RenderOptions,
): Promise<string | null> {
    const { fileInfo } = doc;
    const { outputFolder, cacheFolder } = options;

    /* skip rendering files which have no output */
    if (!haveOutputFile(fileInfo)) {
        return null;
    }

    /* ensure output directory exists */
    const dst = getOutputFilePath(outputFolder, fileInfo);
    const mkdir = fs.mkdir(path.dirname(dst), { recursive: true });

    const topnav = nav.topnav;
    const sidenav = findSidenav(doc, nav.sidenav);
    if (sidenav && isNavigationSection(sidenav)) {
        sortNavigationTree(sidenav);
    }

    const njk = new nunjucks.Environment(loader, { autoescape: false });
    const asyncRender = promisify<string, object, string>(njk.render);
    const renderTemplate = asyncRender.bind(njk);
    const template = findTemplate(doc.fileInfo, doc);
    const templateData = {
        ...options.templateData,
        site: options.site,
        doc,
        topnav,
        sidenav,
        vendors,
    };

    const generatedExamples: ExampleCompileTask[] = [];
    const generatedStandalone: ExampleStandaloneTask[] = [];

    const markdownRenderer = createMarkdownRenderer({
        docs,
        generateExample({ source, language, filename, tags }) {
            const example = generateExample({
                source,
                language,
                filename,
                parent: fileInfo.fullPath,
                setupPath: options.setupPath,
                exampleFolders: options.exampleFolders,
                tags,
            });

            if (example.output) {
                const { dir, name } = path.parse(example.output);
                generatedExamples.push(example.task);
                generatedStandalone.push({
                    outputFile: path.join(dir, `${name}.html`),
                    content: example.markup,
                });
            }

            return example;
        },
        addResource(dst, src) {
            if (!existsSync(src)) {
                throw new Error(`Failed to find image "${src}"`);
            }
            options.addResource(dst, src);
        },
        handleSoftError(error) {
            /* rethrow error so we get hard fails on everything */
            throw error;
        },
    });

    njk.addFilter("marked", (content: string) => {
        return markdownRenderer.render(doc, content);
    });
    njk.addFilter("json", (value: unknown) => {
        return JSON.stringify(value, null, 2);
    });
    njk.addFilter("dump", (value: unknown) => {
        return `<pre>${JSON.stringify(value, null, 2)}</pre>`;
    });
    njk.addFilter(
        "relative",
        (url: string, { fileInfo }: { fileInfo: FileInfo }) => {
            if (isExternalUrl(url)) {
                return url;
            }
            const outputFile = `./${path.join(fileInfo.path)}`;
            if (isAbsoluteUrl(url)) {
                /* `/foo` to `./foo` */
                url = `.${url}`;
            }
            if (outputFile === url || `${outputFile}/` === url) {
                return "./";
            }
            const relative = path.relative(outputFile, url).replace(/\\/g, "/");

            /* force ./ in front of url unless a path already has ./ ../ or similar */
            const prefix = relative.startsWith(".") ? "" : "./";

            /* retain trailing / if present in original url */
            const suffix = url.endsWith("/") ? "/" : "";

            return [prefix, relative, suffix].join("");
        },
    );
    njk.addExtension("BlockContainer", {
        tags: ["container"],
        parse(parser, nodes) {
            const tok = parser.nextToken();
            const args = parser.parseSignature(null, true);
            parser.advanceAfterBlockEnd(tok.value);
            return new nodes.CallExtensionAsync(this, "run", args, []);
        },
        async run(
            { ctx }: { ctx: Record<string, unknown> },
            container: string,
            callback: (
                err: Error | null,
                data: nunjucks.runtime.SafeString,
            ) => void,
        ) {
            const blocks = options.templateBlocks.get(container) ?? [];
            const promises = blocks.map(({ renderer }) => {
                if ("filename" in renderer) {
                    return renderTemplate(renderer.filename, {
                        ...ctx,
                        ...renderer.data,
                    });
                }
                if ("render" in renderer) {
                    return Promise.resolve(renderer.render());
                }
                return Promise.resolve("");
            });
            const content = await Promise.all(promises);
            const markup = content.join("");
            return callback(null, new nunjucks.runtime.SafeString(markup));
        },
    } as nunjucks.Extension);
    njk.addFilter(
        "take",
        <T extends Record<string, unknown>>(
            haystack: T[],
            key: string,
            value: string,
        ): T[] => {
            return haystack.filter((it) => it[key] === value);
        },
    );

    await mkdir;

    let content;
    try {
        content = await renderTemplate(template, templateData);
    } catch (err: unknown) {
        const prefix = `Failed to render "${fileInfo.fullPath}"`;
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`${prefix}: ${message}`, { cause: err });
    }

    const writeFile = fs.writeFile(dst, content ?? "null", "utf-8");

    try {
        await compileExamples({
            fileInfo,
            cacheFolder,
            outputFolder,
            tasks: generatedExamples,
            vendors,
        });
    } catch (err: unknown) {
        const prefix = `Failed to compile examples from "${fileInfo.fullPath}"`;
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`${prefix}: ${message}`, { cause: err });
    }

    try {
        await compileStandalones({
            fileInfo,
            cacheFolder,
            outputFolder,
            tasks: generatedStandalone,
            renderTemplate,
            templateData,
        });
    } catch (err: unknown) {
        const prefix = `Failed to render standalone examples from "${fileInfo.fullPath}"`;
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`${prefix}: ${message}`, { cause: err });
    }

    await writeFile;
    return dst;
}
