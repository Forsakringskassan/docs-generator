import cliProgress from "cli-progress";
import { type DocumentPage, isDocumentPage } from "../document";
import { type Processor } from "../processor";
import { render } from "./render";
import { type RenderOptions } from "./render-options";

const progressbar = new cliProgress.SingleBar({
    format: " {bar} {percentage}% | {value}/{total} documents | {filename}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
    clearOnComplete: true,
});

export function nunjucksProcessor(
    options: Omit<
        RenderOptions,
        "templateBlocks" | "templateData" | "addResource"
    >,
): Processor {
    return {
        stage: "render",
        name: "nunjucks-renderer",
        async handler(context) {
            function renderDocument(doc: DocumentPage): Promise<string | null> {
                const nav = {
                    topnav: context.topnav,
                    sidenav: context.sidenav,
                };
                return render(doc, context.docs, nav, context.vendors, {
                    ...options,
                    templateBlocks: context.getAllTemplateBlocks(),
                    templateData: context.getAllTemplateData(),
                    addResource(dst, src) {
                        context.addResource(dst, src);
                    },
                });
            }

            const formats = ["markdown", "json"];
            const docs = context.docs.filter(isDocumentPage).filter((it) => {
                /* the nunjucks process primarly renders markdown documents but
                 * for legacy reasons it also renders raw json files */
                if (!formats.includes(it.format)) {
                    return false;
                }
                return it.fileInfo.outputName;
            });

            progressbar.start(docs.length, 0, {
                filename: docs.length > 0 ? docs[0].fileInfo.fullPath : "",
            });

            const generatedFiles: string[] = [];
            try {
                for (const doc of docs) {
                    const filePath = await renderDocument(doc);
                    if (filePath) {
                        generatedFiles.push(filePath);
                    }
                    progressbar.increment(1, {
                        filename: doc.fileInfo.fullPath,
                    });
                }
            } finally {
                progressbar.stop();
            }

            context.log(docs.length, "documents rendered");
            return generatedFiles;
        },
    };
}
