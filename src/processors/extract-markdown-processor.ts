import fs from "node:fs/promises";
import path from "node:path";
import fm from "front-matter";
import {
    type Document,
    type DocumentPage,
    getDocumentBody,
    isDocumentPage,
    isDocumentPartial,
} from "../document";
import { type PartialFile } from "../file-reader";
import { type Manifest } from "../manifest";
import { type Processor, type ProcessorOptions } from "../processor";
import {
    findDocument,
    getFingerprint,
    getOutputFilePath,
    haveOutput,
    takeWhile,
    zip,
} from "../utils";
import { manifestState } from "./manifest-processor";

type ManifestPage = Manifest["pages"][number];

/**
 * Options for `extractMarkdownProcessor`.
 *
 * @public
 */
export interface ExtractMarkdownOptions extends ProcessorOptions {
    /**
     * Folder to write docs to.
     */
    outputFolder: string;
}

async function copyFile(src: string, dst: string): Promise<void> {
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.cp(src, dst);
}

function equal<T>(values: [T, T]): boolean {
    return values[0] === values[1];
}

/**
 * Finds the common path segments from two paths.
 */
function commonPath(a: string, b: string): string {
    const it = zip(a.split(path.sep), b.split(path.sep));
    const common = Array.from(takeWhile(it, equal), (it) => it[0]);
    return common.join(path.sep);
}

async function extractExamples(
    page: ManifestPage,
    options: { outputFolder: string },
): Promise<void> {
    const { outputFolder } = options;
    for (const example of page.examples) {
        /* inline examples do not have a source file */
        if (!example.src) {
            continue;
        }
        const common = commonPath(
            path.resolve(outputFolder),
            path.resolve(example.src),
        );
        const subpath = path.relative(common, path.resolve(example.src));
        await copyFile(example.src, path.join(outputFolder, "files", subpath));
    }
}

function isMarkdown(doc: DocumentPage): boolean {
    return doc.format === "markdown";
}

async function getFrontMatter(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath, "utf8");
    const { attributes } = fm<Record<string, unknown>>(content);
    delete attributes.redirect_from;
    if (Object.keys(attributes).length === 0) {
        return "";
    }
    return `---\n${JSON.stringify(attributes)}\n---\n\n`;
}

function cmp(this: void, a: [string, string], b: [string, string]): number {
    return a[0].localeCompare(b[0]);
}
async function extractDocument(
    doc: DocumentPage,
    docs: Document[],
    partials: Map<string, PartialFile>,
    options: { outputFolder: string },
): Promise<void> {
    const { outputFolder } = options;
    const markdown = doc.body.replaceAll(
        /^:::\s*api(.*)\n([\s\S]+?):::/gm,
        (match, info: string, content: string) => {
            const needle = content.trim();
            const trimmedInfo = info.trim();
            const tags = trimmedInfo ? trimmedInfo.split(/\s+/) : [];
            const result = findDocument(docs, needle);
            if (!result.document) {
                return match;
            }

            const { document, kind, reference } = result;
            if (!isDocumentPartial(document)) {
                return match;
            }

            const body = getDocumentBody(document, tags, {
                kind,
                reference,
            });
            const fingerprint = getFingerprint(body);
            const id = `partial:${document.format}:${fingerprint}`;

            partials.set(id, {
                id,
                format: document.format,
                body,
            });

            return `:::api\n${id}\n:::\n`;
        },
    );
    const src = doc.fileInfo.fullPath;
    const dst = path.join(outputFolder, "files", doc.fileInfo.fullPath);
    const fm = await getFrontMatter(src);
    const content = `${fm}${markdown}`;

    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, content, "utf8");
}

async function extractDocuments(
    docs: Document[],
    partials: Map<string, PartialFile>,
    options: { outputFolder: string },
): Promise<void> {
    const files = docs
        .filter(isDocumentPage)
        .filter(isMarkdown)
        .filter(haveOutput)
        .map((doc) => extractDocument(doc, docs, partials, options));
    await Promise.all(files);
}

async function extractPartials(
    partials: Map<string, PartialFile>,
    options: { outputFolder: string },
): Promise<void> {
    const { outputFolder } = options;
    const dst = path.join(outputFolder, "partials.json");
    const content = JSON.stringify(Array.from(partials.values()), null, 2);
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, content, "utf8");
}

async function extractLinks(
    docs: Document[],
    options: { outputFolder: string },
): Promise<void> {
    const { outputFolder } = options;
    const links = new Map<string, string>();
    const pages = docs.filter(isDocumentPage).filter(haveOutput);
    for (const page of pages) {
        const path = getOutputFilePath("", page.fileInfo);
        links.set(page.id, path);
        if (!links.has(page.name)) {
            links.set(page.name, path);
        }
        for (const alias of page.alias) {
            if (!links.has(alias)) {
                links.set(alias, path);
            }
        }
    }
    const sorted = Array.from(links).toSorted(cmp);
    const entries = Object.fromEntries(sorted);
    const content = JSON.stringify(entries, null, 2);
    const dst = path.join(outputFolder, "links.json");
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, content, "utf8");
}

async function writeIndex(options: { outputFolder: string }): Promise<void> {
    const { outputFolder } = options;
    const dst = path.join(outputFolder, "index.mjs");
    const lines = [
        `import path from "node:path";`,
        `import { frontMatterFileReader, partialFileReader } from "@forsakringskassan/docs-generator";`,
        ``,
        `export const basename = import.meta.dirname;`,
        `export const sourceFiles = [`,
        `    { `,
        `        include: path.join(basename, "files/**/*.md"),`,
        `        basename,`,
        `        fileReader: frontMatterFileReader,`,
        `    }`,
        `    { `,
        `        include: path.join(basename, "partials.json"),`,
        `        basename,`,
        `        fileReader: partialFileReader,`,
        `    }`,
        `];`,
    ];
    await fs.writeFile(dst, lines.join("\n"), "utf8");
}

async function writeDts(options: { outputFolder: string }): Promise<void> {
    const { outputFolder } = options;
    const dst = path.join(outputFolder, "index.d.mts");
    const lines = [
        `import { SourceFiles } from "@forsakringskassan/docs-generator";`,
        ``,
        `export declare const basename: string;`,
        `export declare const sourceFiles: SourceFiles[];`,
    ];
    await fs.writeFile(dst, lines.join("\n"), "utf8");
}

/**
 * Processor to extract and write examples to separate files.
 *
 * @public
 */
export function extractMarkdownProcessor(
    options: ExtractMarkdownOptions,
): Processor {
    const { enabled = true, outputFolder } = options;

    return {
        after: "render",
        name: "extract-markdown-processor",
        async handler(context) {
            if (!enabled) {
                return;
            }

            if (!outputFolder) {
                throw new Error(
                    `"outputFolder" not set in "extractMarkdownProcessor(..)"`,
                );
            }

            const manifest = context.getState(manifestState);
            if (!manifest) {
                throw new Error(
                    `"extractMarkdownProcessor()" requires "manifestProcess()"`,
                );
            }

            /* clear and recreate old output folder */
            await fs.rm(outputFolder, { recursive: true, force: true });
            await fs.mkdir(outputFolder, { recursive: true });

            /* copy all resources from rendered pages */
            const partials = new Map<string, PartialFile>();
            await extractDocuments(context.docs, partials, { outputFolder });
            await extractPartials(partials, { outputFolder });
            await extractLinks(context.docs, { outputFolder });
            const { pages } = manifest;
            const resources = pages.map((page) => {
                return extractExamples(page, { outputFolder });
            });
            await Promise.all(resources);

            /* write an index for programmatical usage */
            await writeIndex({ outputFolder });
            await writeDts({ outputFolder });
        },
    };
}
