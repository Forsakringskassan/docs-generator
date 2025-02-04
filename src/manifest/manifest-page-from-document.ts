import markdownIt from "markdown-it";
import { type Document } from "../document";
import { DocumentOutline } from "../document-outline";
import { findTag, getFingerprint, getOutputFilePath, hasTag } from "../utils";
import { parseInfostring } from "../examples";
import { type Manifest } from "./manifest";

type DocumentWithOutput = Document & { fileInfo: { outputName: string } };
type DocumentLike = Pick<
    DocumentWithOutput,
    "fileInfo" | "name" | "attributes" | "outline" | "body" | "format"
>;
type ManifestPage = Manifest["pages"][number];
type ManifestOutline = ManifestPage["outline"];
type ManifestExamples = ManifestPage["examples"];

const md = markdownIt();

md.renderer.rules.fence = (
    tokens,
    idx,
    _options,
    collected: ManifestExamples,
) => {
    const { content, info, map } = tokens[idx];
    const { language, tags } = parseInfostring(info);
    const hashContent = `${map?.[0]}:${map?.[1]}:${info}:${content}`;
    const fingerprint = getFingerprint(hashContent);
    let extension = undefined;

    if (language === "import") {
        extension = content.split(".").at(-1)?.trim();
    }

    if (hasTag(tags, "hidden")) {
        return "";
    }

    const name = findTag(tags, "name")?.value ?? undefined;

    collected.push({
        name,
        selector: `#example-${fingerprint}`,
        language: extension ?? language,
        tags,
    });
    return "";
};

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
    md.render(doc.body, collected);
    return collected;
}

/**
 * @internal
 */
export function manifestPageFromDocument(doc: DocumentLike): ManifestPage {
    const { body, fileInfo, format } = doc;
    return {
        path: getOutputFilePath("", fileInfo),
        title: doc.attributes.title ?? doc.name ?? "",
        redirect: format === "redirect" ? body : null,
        outline: flattenOutline(doc.outline),
        examples: findExamples(doc),
    };
}
