import markdownIt from "markdown-it";
import { type DocumentOutline, type DocumentPage } from "../document";
import { parseInfostring } from "../examples";
import { type ProcessorContext } from "../processor-context";
import {
    type FileMatcher,
    findTag,
    getFingerprint,
    getOutputFilePath,
    hasTag,
    parseImport,
} from "../utils";
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

interface MarkdownEnv {
    readonly collected: ManifestExamples;
    readonly exampleFileMatcher: FileMatcher;
}

const md = markdownIt();

md.renderer.rules.fence = (
    tokens,
    idx,
    _options,
    env: MarkdownEnv,
    /* eslint-disable-next-line sonarjs/no-invariant-returns -- function works as intended */
) => {
    const { collected, exampleFileMatcher } = env;
    const { content, info, map } = tokens[idx];
    const { language: rawLanguage, tags } = parseInfostring(info);
    const hashContent = `${String(map?.[0])}:${String(map?.[1])}:${info}:${content}`;
    const fingerprint = getFingerprint(hashContent);
    let extension = undefined;
    let src: string | null = null;
    let language = rawLanguage;

    if (hasTag(tags, "compare")) {
        language = "diff";
    }

    if (language === "import") {
        const parsed = parseImport(content);
        src = exampleFileMatcher(parsed.filename);
        extension = parsed.extension;
    }

    if (hasTag(tags, "hidden")) {
        return "";
    }

    const name = findTag(tags, "name")?.value ?? undefined;

    collected.push({
        name,
        src,
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

function findExamples(
    context: Pick<ProcessorContext, "exampleFileMatcher">,
    doc: DocumentPageLike,
): ManifestExamples {
    const { exampleFileMatcher } = context;
    if (doc.format !== "markdown") {
        return [];
    }
    const collected: ManifestExamples = [];
    md.render(doc.body, {
        exampleFileMatcher,
        collected,
    } satisfies MarkdownEnv);
    return collected;
}

/**
 * @internal
 */
export function manifestPageFromDocument(
    context: Pick<ProcessorContext, "exampleFileMatcher">,
    doc: DocumentPageLike,
): ManifestPage {
    const { body, fileInfo, format } = doc;
    return {
        path: getOutputFilePath("", fileInfo),
        src: doc.fileInfo.fullPath,
        title: doc.attributes.title ?? doc.name,
        redirect: format === "redirect" ? body : null,
        outline: flattenOutline(doc.outline),
        examples: findExamples(context, doc),
    };
}
