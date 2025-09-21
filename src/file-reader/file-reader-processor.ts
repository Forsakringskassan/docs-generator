import { glob } from "glob";
import { type Document } from "../document";
import { type Processor } from "../processor";
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

async function getDocumentsForSource(src: SourceFiles): Promise<Document[]> {
    const { transform } = src;
    const include = await globAll(src.include);
    const exclude = await globAll(src.exclude);
    const files = Array.from(difference(include, exclude));
    const promises = files.map(async (it) => {
        const docs = await src.fileReader(it, src.basePath);
        if (transform) {
            return docs.map((it) => transform(it));
        } else {
            return docs;
        }
    });
    const docs = await Promise.all(promises);
    return docs.flat();
}

async function getAllDocuments(
    sourceFiles: SourceFiles[],
): Promise<Document[]> {
    const result = await Promise.all(sourceFiles.map(getDocumentsForSource));
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
            const result = await getAllDocuments(sourceFiles);
            context.addDocument(result);
            context.log(result.length, "documents found");
        },
    };
}
