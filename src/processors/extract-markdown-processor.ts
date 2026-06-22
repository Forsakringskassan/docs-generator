import fs from "node:fs/promises";
import path from "node:path";
import fm from "front-matter";
import {
    type Document,
    type DocumentPage,
    type DocumentPartial,
    getDocumentBody,
    isDocumentPage,
    isDocumentPartial,
} from "../document";
import { type Processor } from "../processor";
import {
    findDocument,
    getFingerprint,
    getOutputFilePath,
    haveOutput,
} from "../utils";

interface Partial {
    id: string;
    name: string;
    format: DocumentPartial["format"];
    body: string;
}

/**
 * Options for {@link extractMarkdownProcessor}.
 *
 * @public
 */
export interface ExtractMarkdownProcessorOptions {
    /**
     * Folder to write markdown files to.
     */
    outputFolder: string;
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
    outputFolder: string,
    doc: DocumentPage,
    docs: Document[],
    partials: Map<string, Partial>,
): Promise<void> {
    const markdown = doc.body.replaceAll(
        /^:::\s*api(.*)\n([^]+?):::/gm,
        (match, info: string, content: string) => {
            const needle = content.trim();
            const tags = info.trim().split(/\s+/);
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

            partials.set(fingerprint, {
                id,
                name: document.name,
                format: document.format,
                body,
            });

            return `:::api\n${id}\n:::\n`;
        },
    );

    const src = doc.fileInfo.fullPath;
    const dst = path.join(outputFolder, doc.fileInfo.fullPath);
    const fm = await getFrontMatter(src);
    const content = `${fm}${markdown}`;

    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, content, "utf8");
}

async function extractDocuments(
    outputFolder: string,
    docs: Document[],
    partials: Map<string, Partial>,
): Promise<void> {
    const files = docs
        .filter(isDocumentPage)
        .filter(isMarkdown)
        .filter(haveOutput)
        .map((doc) => extractDocument(outputFolder, doc, docs, partials));
    await Promise.all(files);
}

async function extractPartials(
    outputFolder: string,
    partials: Map<string, Partial>,
): Promise<void> {
    const dst = path.join(outputFolder, "partials.json");
    const content = JSON.stringify(Array.from(partials.values()), null, 2);
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, content, "utf8");
}

async function extractLinks(
    outputFolder: string,
    docs: Document[],
): Promise<void> {
    const links = new Map<string, string>();
    const pages = docs.filter(isDocumentPage).filter(haveOutput);
    for (const page of pages) {
        const path = getOutputFilePath("", page.fileInfo);
        links.set(page.id, path);
        links.set(page.name, path);
        for (const alias of page.alias) {
            links.set(alias, path);
        }
    }
    const sorted = Array.from(links.entries()).toSorted(cmp);
    const entries = Object.fromEntries(sorted);
    const content = JSON.stringify(entries, null, 2);
    const dst = path.join(outputFolder, "links.json");
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.writeFile(dst, content, "utf8");
}

/**
 * Markdown extraction (with MD to MD transformation).
 *
 * @public
 */
export function extractMarkdownProcessor(
    options: ExtractMarkdownProcessorOptions,
): Processor {
    const { outputFolder } = options;
    return {
        name: "extractMarkdownProcessor",
        after: "render",
        async handler({ docs }) {
            const partials = new Map<string, Partial>();
            await extractDocuments(outputFolder, docs, partials);
            await extractPartials(outputFolder, partials);
            await extractLinks(outputFolder, docs);
        },
    };
}
