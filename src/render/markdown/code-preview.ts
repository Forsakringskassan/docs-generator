import path from "node:path";
import { createTwoFilesPatch } from "diff";
import type MarkdownIt from "markdown-it";
import {
    type ExampleResult,
    parseInfostring,
    transformCode,
} from "../../examples";
import {
    findTag,
    getFingerprint,
    hasTag,
    htmlencode,
    parseImport,
} from "../../utils";
import { type MarkdownEnv } from "../markdown-env";
import { findTestId, highlight, replaceAtLink } from "./utils";

/**
 * @internal
 */
export interface CodePreviewOptions {
    /** Callback when an example should be generated */
    generateExample(
        this: void,
        options: {
            source: string;
            language: string;
            filename: string;
            tags: string[];
        },
    ): ExampleResult;

    /** Callback to get source for an imported filename */
    getImportedSource(this: void, filename: string): string;
}

function getVariant(tags: string[]): "default" | "borderless" {
    if (tags.includes("borderless") || tags.includes("live-example")) {
        return "borderless";
    }
    return "default";
}

function getStandalonePath(output: string | null): string | null {
    if (!output) {
        return null;
    }
    const { dir, name } = path.parse(output);
    return path.join(dir, `${name}.html`);
}

function ensureTrailingNewline(text: string): string {
    if (text.endsWith("\n")) {
        return text;
    } else {
        return `${text}\n`;
    }
}

function serializeAttributes(
    attributes: Record<string, string | boolean | null | undefined>,
): string {
    return Object.entries(attributes)
        .flatMap(([key, value]) => {
            if (value === false || value === null || value === undefined) {
                return [];
            }

            if (value === true) {
                return key;
            }

            return `${key}="${htmlencode(value)}"`;
        })
        .join(" ");
}

export function codePreview(
    options: CodePreviewOptions,
): (md: MarkdownIt) => void {
    const { generateExample, getImportedSource } = options;

    return (md: MarkdownIt): void => {
        md.renderer.rules.fence = fence.bind(undefined, md);
    };

    function getSource(
        content: string,
        language: string,
        tags: string[],
        env: Pick<MarkdownEnv, "namedExamples">,
    ): { source: string; language: string } {
        const { namedExamples } = env;

        if (language === "import") {
            const parsed = parseImport(content);
            const importedContent = getImportedSource(parsed.filename);
            return getSource(importedContent, parsed.extension, tags, env);
        }

        const compare = findTag(tags, "compare");
        if (compare && compare.value !== null) {
            const { value: context } = findTag(tags, "context") ?? {};
            const reference = namedExamples.get(compare.value);
            if (!reference) {
                throw new Error(
                    `Failed to find referenced example "${compare.value}"`,
                );
            }
            const a = ensureTrailingNewline(
                transformCode(reference.content, reference.language),
            );
            const b = ensureTrailingNewline(transformCode(content, language));
            const diff = createTwoFilesPatch("a", "b", a, b, "", "", {
                context: context ? Number.parseInt(context, 10) : 3,
                ignoreWhitespace: true,
            })
                .split("\n")
                .slice(4) // remove header
                .join("\n");
            return {
                source: diff,
                language: "diff",
            };
        }

        return { source: content, language };
    }

    function fence(
        _md: MarkdownIt,
        tokens: MarkdownIt.Token[],
        idx: number,
        _options: MarkdownIt.Options,
        env: MarkdownEnv,
    ): string {
        const { fileInfo } = env;
        const { content: rawContent, info, map } = tokens[idx];
        const { language: rawLanguage, tags: rawTags } = parseInfostring(info);

        const { source, language } = getSource(
            rawContent,
            rawLanguage,
            rawTags,
            env,
        );

        /* store a named reference to this example */
        const name = findTag(rawTags, "name")?.value;
        if (name) {
            env.namedExamples.set(name, {
                name,
                tags: rawTags,
                /* store original raw content unless it is an imported example */
                content: rawLanguage === "import" ? source : rawContent,
                language: rawLanguage === "import" ? language : rawLanguage,
            });
        }

        if (hasTag(rawTags, "hidden")) {
            return "";
        }

        if (rawLanguage === "mermaid") {
            return /* HTML */ `
                <pre class="mermaid">${htmlencode(rawContent)}</pre>
            `;
        }

        /* pass original raw content for imported examples as the original
         * context is needed to resolve paths */
        const needOriginalSource =
            language !== "diff" && rawLanguage === "import";

        const example = generateExample({
            source: needOriginalSource ? rawContent : source,
            language: needOriginalSource ? rawLanguage : language,
            filename: fileInfo.fullPath,
            tags: rawTags,
        });
        const { tags } = example;

        const hashContent = `${String(map?.[0])}:${String(map?.[1])}:${info}:${rawContent}`;
        const fingerprint = getFingerprint(hashContent);
        const transformedCode = transformCode(example.source, example.language);
        const highlightedCode = replaceAtLink(
            highlight({ source: transformedCode, language: example.language }),
        );
        const testId = findTestId(tags) ?? findTag(tags, "name")?.value;
        const staticCode = example.runtime === false || tags.includes("static");
        const noMarkup = tags.includes("nomarkup");
        const fullscreen = tags.includes("fullscreen");
        const variant = getVariant(tags);
        const standalonePath = getStandalonePath(example.output);
        const showFullscreen = Boolean(standalonePath) && fullscreen;
        const filteredTags = tags.filter((it) => {
            if (
                it.startsWith("test-id=") ||
                it.startsWith("name") ||
                it.startsWith("compare")
            ) {
                return false;
            }
            return true;
        });
        const dataTagsAttr =
            filteredTags.length > 0 ? filteredTags.join(" ") : "";
        const serializedAttributes = serializeAttributes({
            id: `example-${fingerprint}`,
            class: "code-preview",
            variant,
            fullscreen: showFullscreen ? standalonePath : undefined,
            nomarkup: noMarkup,
            nopreview: staticCode,
            "data-test": testId,
            "data-tags": dataTagsAttr || undefined,
            "data-language": example.language,
        });
        const previewSlot = staticCode
            ? ""
            : /* HTML */ ` <div slot="preview">${example.markup}</div> `;

        return /* HTML */ `
            <docs-code-preview ${serializedAttributes}>
                ${example.comments.join("\n")} ${previewSlot}
                <span slot="code">${highlightedCode}</span>
            </docs-code-preview>
        `;
    }
}
