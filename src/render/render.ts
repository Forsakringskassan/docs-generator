import fs from "node:fs/promises";
import { existsSync, copyFileSync } from "node:fs";
import path from "node:path";
import pathPosix from "node:path/posix";
import { promisify } from "node:util";
import { execa } from "execa";
import nunjucks from "nunjucks";
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
import { getFingerprint, getOutputFilePath } from "../utils";
import { type RenderOptions } from "./render-options";
import { TemplateLoader } from "./template-loader";
import * as filter from "./filter";
import { findTemplate } from "./find-template";
import { createMarkdownRenderer } from "./create-markdown-renderer";

interface ActiveNavigationLeaf extends NavigationLeaf {
    active: boolean;
}

interface ActiveNavigationSection extends NavigationSection {
    active: boolean;
}

type ActiveNavigationNode = ActiveNavigationLeaf | ActiveNavigationSection;

const scriptPath = path.join(__dirname, "compile-example.js");
let loader: TemplateLoader | null = null;

function haveOutputFile(
    fileInfo: FileInfo,
): fileInfo is FileInfo & { outputName: string } {
    return fileInfo.outputName !== false;
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

    /* skip forking if there are no tasks to be run anyway */
    if (dirtyTasks.length === 0) {
        return;
    }

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
    loader = new TemplateLoader(folders);
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
        rootUrl(doc: Document) {
            const { fileInfo } = doc;
            const relative = pathPosix.relative(fileInfo.path, ".");
            return relative !== "" ? relative : ".";
        },
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
    njk.addFilter("json", filter.json);
    njk.addFilter("dump", filter.dump);
    njk.addFilter("relative", filter.relative);
    njk.addFilter("take", filter.take);
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
                    const data = renderer.data as object;
                    return renderTemplate(renderer.filename, {
                        ...ctx,
                        ...data,
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

    await mkdir;

    let content;
    try {
        content = await renderTemplate(template, templateData);
    } catch (err: unknown) {
        const prefix = `Failed to render "${fileInfo.fullPath}"`;
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`${prefix}: ${message}`, { cause: err });
    }

    const expandedDst = dst.replace(/\[([^]+)\]/g, (match, key) => {
        if (key === "hash") {
            return getFingerprint(doc.body);
        } else {
            return match;
        }
    });
    const writeFile = fs.writeFile(expandedDst, content ?? "null", "utf-8");

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
