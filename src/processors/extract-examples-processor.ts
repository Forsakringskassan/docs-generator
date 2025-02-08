import fs from "node:fs/promises";
import path from "node:path/posix";
import markdownIt from "markdown-it";
import { isDocumentPage, type DocumentPage } from "../document";
import { ProcessorOptions, type Processor } from "../processor";
import { haveOutput, normalizePath, slugify } from "../utils";
import { parseInfostring } from "../examples";

/**
 * Options for `extractExamplesProcessor`.
 *
 * @public
 */
export interface ExtractExamplesOptions extends ProcessorOptions {
    outputFolder: string;
    languages?: string[];
}

interface Example {
    name: string | undefined;
    content: string;
    language: string;
    tags: string[];
}

type DocumentWithOutput = DocumentPage & { fileInfo: { outputName: string } };
type DocumentLike = Pick<DocumentWithOutput, "fileInfo" | "body" | "format">;

const md = markdownIt();

md.renderer.rules.fence = (tokens, idx, _options, collected: Example[]) => {
    const { content, info } = tokens[idx];
    const { language, tags } = parseInfostring(info);

    if (language === "import") {
        return "";
    }

    const nameTag = tags.find((it) => it.startsWith("name="));
    const name = nameTag ? slugify(nameTag.slice("name=".length)) : undefined;

    collected.push({
        name,
        content,
        language,
        tags,
    });

    return "";
};

function findExamples(doc: DocumentLike): Example[] {
    if (doc.format !== "markdown") {
        return [];
    }
    const collected: Example[] = [];
    md.render(doc.body, collected);
    return collected;
}

function getSuffix(tags: string[]): string {
    const relevant = tags.filter((it) => ["nocompile", "nolint"].includes(it));
    if (relevant.length > 0) {
        return `-${relevant.join("-")}`;
    } else {
        return "";
    }
}

function getExtension(lang: string): string {
    switch (lang) {
        case "typescript":
            return "ts";
        case "javascript":
            return "js";
        default:
            return lang;
    }
}

/**
 * Processor to extract and write examples to separate files.
 *
 * @public
 */
export function extractExamplesProcessor(
    options: ExtractExamplesOptions,
): Processor {
    const {
        enabled = true,
        outputFolder,
        languages = ["javascript", "typescript", "css", "scss"],
    } = options;

    function isRelevant(example: Example): boolean {
        return languages.includes(example.language);
    }

    return {
        stage: "render",
        name: "extract-examples-processor",
        async handler(context) {
            if (!enabled) {
                return;
            }

            if (!outputFolder) {
                throw new Error(
                    `"outputFolder" not set in "extractExamplesProcessor(..)"`,
                );
            }

            /* clear old folder to remove potential obsolete files */
            await fs.rm(outputFolder, { recursive: true, force: true });

            const docs = context.docs.filter(isDocumentPage).filter(haveOutput);

            let total = 0;
            for (const doc of docs) {
                const examples = findExamples(doc).filter(isRelevant);
                if (examples.length === 0) {
                    continue;
                }

                /* create a directory matching the filename the examples is contained in */
                const dir = normalizePath(outputFolder, doc.fileInfo.fullPath);
                await fs.mkdir(dir, { recursive: true });

                /* write each example into the directory */
                let n = 1;
                for (const example of examples) {
                    const suffix = getSuffix(example.tags);
                    const extension = getExtension(example.language);
                    const filename = `example-${example.name ?? String(n++)}${suffix}.${extension}`;
                    const filePath = path.join(dir, filename);
                    await fs.writeFile(filePath, example.content, "utf-8");
                    total++;
                }
            }

            context.log(total, "examples extracted");
        },
    };
}
