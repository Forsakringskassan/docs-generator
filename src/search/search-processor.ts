import { type DocumentPage, isDocumentPage } from "../document";
import { type Processor } from "../processor";
import { getFingerprint, getIntegrity, getOutputFilePath } from "../utils";
import { SearchEntry } from "./search-entry";
import { generateIndex } from "./generate-index";

function extractTerms(doc: DocumentPage): string[] {
    const { title, component } = doc.attributes;
    if (title && component) {
        return component.map((it) => `${title} (${it.name})`);
    } else if (component) {
        return component.map((it) => it.name);
    } else if (title) {
        return [title];
    } else {
        return [];
    }
}

function isIndexable(doc: DocumentPage): boolean {
    const { visible, fileInfo, format } = doc;
    return Boolean(visible && fileInfo.outputName && format !== "redirect");
}

function getTerms(doc: DocumentPage): SearchEntry {
    return {
        url: getOutputFilePath(".", doc.fileInfo) ?? "",
        title: doc.name,
        words: extractTerms(doc),
    };
}

/**
 * @public
 */
export function searchProcessor(): Processor {
    return {
        after: "generate-docs",
        name: "search-processor",
        handler(context) {
            const entries = context.docs
                .filter(isDocumentPage)
                .filter(isIndexable)
                .map(getTerms);
            const index = generateIndex(entries);
            const body = JSON.stringify(index);
            const fingerprint = getFingerprint(body);
            const integrity = getIntegrity(body);
            const outputName = `search-data-[hash].json`;
            const expandedName = `search-data-${fingerprint}.json`;
            context.setTemplateData("searchDataUrl", expandedName);
            context.setTemplateData("searchDataIntegrity", integrity);
            context.addDocument({
                kind: "page",
                id: "search:data",
                name: "search-data",
                alias: [],
                visible: false,
                attributes: {
                    sortorder: Infinity,
                    redirectFrom: [],
                },
                body,
                outline: [],
                format: "json",
                tags: [],
                template: "json",
                fileInfo: {
                    path: "",
                    name: "virtual:search-data",
                    fullPath: "virtual:search-data",
                    outputName,
                },
            });
            context.addTemplateBlock("toolbar", "search-toolbar", {
                filename: "partials/search-toolbar.html",
            });
            context.addTemplateBlock("body:end", "search-dialog", {
                filename: "partials/search-dialog.html",
            });
            context.log("Indexed", entries.length, "documents");
        },
    };
}
