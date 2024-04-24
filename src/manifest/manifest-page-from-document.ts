import markdownIt from "markdown-it";
import { type Document } from "../document";
import { DocumentOutline } from "../document-outline";
import { getFingerprint, getOutputFilePath } from "../utils";
import { type Manifest } from "./manifest";

type DocumentWithOutput = Document & { fileInfo: { outputName: string } };
type DocumentLike = Pick<
    DocumentWithOutput,
    "fileInfo" | "name" | "attributes" | "outline" | "body" | "format"
>;
type ManifestPage = Manifest["pages"][number];
type ManifestOutline = ManifestPage["outline"];
type ManifestExamples = ManifestPage["examples"];

function flattenOutline(outline: DocumentOutline): ManifestOutline {
    return outline.flatMap((entry) => {
        return [
            { heading: entry.title, anchor: entry.anchor },
            ...flattenOutline(entry.subheadings),
        ];
    });
}

function findExamples(doc: DocumentLike): ManifestExamples {
    if (doc.format !== "markdown") {
        return [];
    }
    const collected: ManifestExamples = [];
    const md = markdownIt();
    md.renderer.rules.fence = (tokens, idx) => {
        const { content, info, map } = tokens[idx];
        const [language, ...tags] = info.split(/\s+/);
        const hashContent = `${map?.[0]}:${map?.[1]}:${info}:${content}`;
        const fingerprint = getFingerprint(hashContent);
        collected.push({
            selector: `#example-${fingerprint}`,
            language,
            tags,
        });
        return "";
    };
    md.render(doc.body);
    return collected;
}

/**
 * @internal
 */
export function manifestPageFromDocument(doc: DocumentLike): ManifestPage {
    const { fileInfo } = doc;
    return {
        path: getOutputFilePath("", fileInfo),
        title: doc.attributes.title ?? doc.name ?? "",
        outline: flattenOutline(doc.outline),
        examples: findExamples(doc),
    };
}
