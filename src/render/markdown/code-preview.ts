import path from "node:path";
import { createTwoFilesPatch } from "diff";
import type MarkdownIt from "markdown-it";
import {
    type ExampleResult,
    parseInfostring,
    transformCode,
} from "../../examples";
import { type MarkdownEnv } from "../markdown-env";
import {
    findTag,
    getFingerprint,
    hasTag,
    htmlencode,
    parseImport,
} from "../../utils";
import { findTestId, highlight, replaceAtLink } from "./utils";

/**
 * @internal
 */
export interface CodePreviewOptions {
    /** Callback when an example should be generated */
    generateExample(options: {
        source: string;
        language: string;
        filename: string;
        tags: string[];
    }): ExampleResult;

    /** Callback to get source for an imported filename */
    getImportedSource(filename: string): { filePath: string; content: string };

    dependencies: Set<string>;
}

function getClassModifier(tags: string[]): string {
    if (tags.includes("borderless")) {
        return "code-preview--borderless";
    }
    return "code-preview--default";
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

export function codePreview(
    options: CodePreviewOptions,
): (md: MarkdownIt) => void {
    const { dependencies, generateExample, getImportedSource } = options;

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
            const imported = getImportedSource(parsed.filename);
            dependencies.add(imported.filePath);
            return getSource(imported.content, parsed.extension, tags, env);
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
                context: context ? parseInt(context, 10) : 3,
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

        const hashContent = `${map?.[0]}:${map?.[1]}:${info}:${rawContent}`;
        const fingerprint = getFingerprint(hashContent);
        const transformedCode = transformCode(example.source, example.language);
        const highlightedCode = replaceAtLink(
            highlight({ source: transformedCode, language: example.language }),
        );
        const testId = findTestId(tags) ?? findTag(tags, "name")?.value;
        const liveExample = tags.includes("live-example");
        const staticCode = example.runtime === false || tags.includes("static");
        const noMarkup = tags.includes("nomarkup");
        const fullscreen = tags.includes("fullscreen");
        const modifier = getClassModifier(tags);
        const standalonePath = getStandalonePath(example.output);
        const showFullscreen = Boolean(standalonePath) && fullscreen;
        const testIdAttr = testId ? `data-test="${testId}"` : "";
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
            filteredTags.length > 0
                ? `data-tags="${htmlencode(filteredTags.join(" "))}"`
                : "";

        if (liveExample) {
            return /* HTML */ `
                <div
                    id="example-${fingerprint}"
                    class="code-preview code-preview--borderless"
                    ${testIdAttr}
                    ${dataTagsAttr}
                    data-language="${example.language}"
                >
                    ${example.markup}
                </div>
            `;
        }

        if (staticCode) {
            return /* HTML */ `
                <div
                    id="example-${fingerprint}"
                    class="code-preview ${modifier}"
                    ${testIdAttr}
                    ${dataTagsAttr}
                    data-language="${example.language}"
                >
                    ${example.comments.join("\n")}
                    <pre class="code-preview__markup">${highlightedCode}</pre>
                </div>
            `;
        }

        if (noMarkup) {
            return /* HTML */ `
                <div
                    id="example-${fingerprint}"
                    class="code-preview ${modifier}"
                    ${testIdAttr}
                    ${dataTagsAttr}
                    data-language="${example.language}"
                >
                    ${example.comments.join("\n")}
                    <div class="code-preview__preview">${example.markup}</div>
                </div>
            `;
        }

        const toggleMarkup = /* HTML */ `
            <button
                type="button"
                class="button button--discrete code-preview__toggle-markup"
                aria-expanded="false"
                onclick="toggleMarkup(this)"
            >
                <i class="icon icon--code"></i>
                Visa kod
            </button>
        `;

        const toggleFullscreen = showFullscreen
            ? /* HTML */ `
                  <a href="${standalonePath}" class="code-preview__fullscreen">
                      <i class="icon icon--fullscreen"></i>
                      Helskärm
                  </a>
              `
            : "";

        return /* HTML */ `
            <div
                id="example-${fingerprint}"
                class="code-preview ${modifier}"
                ${testIdAttr}
                ${dataTagsAttr}
                data-language="${example.language}"
            >
                ${example.comments.join("\n")}
                <div class="code-preview__preview">${example.markup}</div>
                <div>${toggleMarkup} ${toggleFullscreen}</div>
                <div
                    class="code-preview__expand animate-expand"
                    style="height: 0px;"
                    hidden
                >
                    <pre class="code-preview__markup">${highlightedCode}</pre>
                </div>
            </div>
        `;
    }
}
