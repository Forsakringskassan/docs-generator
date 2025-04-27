import markdownIt from "markdown-it";
import { type DocumentOutline, type DocumentPage } from "../document";
import { findTag, getFingerprint, getOutputFilePath, hasTag } from "../utils";
import { parseInfostring } from "../examples";
import { type Manifest } from "./manifest";

type DocumentPageWithOutput = DocumentPage & {
    fileInfo: { outputName: string };
};
type DocumentPageLike = Pick<
    DocumentPageWithOutput,
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
    const { language: rawLanguage, tags } = parseInfostring(info);
    const hashContent = `${map?.[0]}:${map?.[1]}:${info}:${content}`;
    const fingerprint = getFingerprint(hashContent);
    let extension = undefined;
    let language = rawLanguage;

    if (hasTag(tags, "compare")) {
        language = "diff";
    }

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

function findExamples(doc: DocumentPageLike): ManifestExamples {
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
export function manifestPageFromDocument(doc: DocumentPageLike): ManifestPage {
    const { body, fileInfo, format } = doc;
    return {
        path: getOutputFilePath("", fileInfo),
        title: doc.attributes.title ?? doc.name ?? "",
        redirect: format === "redirect" ? body : null,
        outline: flattenOutline(doc.outline),
        examples: findExamples(doc),
    };
}
