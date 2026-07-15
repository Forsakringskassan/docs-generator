import { glob } from "glob";
import { type Document } from "../document";
import { type Processor } from "../processor";
import { type ProcessorContext } from "../processor-context";
import { difference } from "../utils";
import { type SourceFiles } from "./source-files";

async function globAll(
    pattern: string | string[] | undefined,
): Promise<Set<string>> {
    if (!pattern) {
        return new Set();
    }

    if (!Array.isArray(pattern)) {
        return globAll([pattern]);
    }

    const results = await Promise.all(
        pattern.map((it) => glob(it, { nodir: true })),
    );
    return new Set(results.flat());
}

async function getDocumentsForSource(
    context: ProcessorContext,
    src: Partial<SourceFiles>,
    index: number,
): Promise<Document[]> {
    const { transform } = src;
    const include = await globAll(src.include);
    const exclude = await globAll(src.exclude);
    const files = Array.from(difference(include, exclude));
    let showWarning = true;
    const promises = files.map(async (it) => {
        if (!src.fileReader) {
            if (showWarning) {
                const lines = JSON.stringify(src, null, 2).split("\n");
                context.error(
                    `"${it}" ignored: \`fileReader\` property was not specified in configuration.`,
                );
                context.error();
                context.error(
                    `The file was matched from sourceFiles[${index}]:`,
                );
                for (const line of lines) {
                    context.error("  ", line);
                }
                context.error();
                context.error("This warning is only shown once.");
                showWarning = false;
            }

            return [];
        }

        const docs = await src.fileReader(it, src.basePath);
        if (transform) {
            return docs.map((it) => transform(it));
        }
        return docs;
    });
    const docs = await Promise.all(promises);
    return docs.flat();
}

async function getAllDocuments(
    context: ProcessorContext,
    sourceFiles: SourceFiles[],
): Promise<Document[]> {
    const result = await Promise.all(
        sourceFiles.map((entry, index) => {
            return getDocumentsForSource(context, entry, index);
        }),
    );
    return result.flat();
}

/**
 * @internal
 */
export function fileReaderProcessor(sourceFiles: SourceFiles[]): Processor {
    return {
        stage: "generate-docs",
        name: "file-reader-processor",
        async handler(context) {
            const result = await getAllDocuments(context, sourceFiles);
            context.addDocument(result);
            context.log(result.length, "documents found");
        },
    };
}
