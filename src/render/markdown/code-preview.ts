import path from "node:path";
import type MarkdownIt from "markdown-it";
import {
    type ExampleResult,
    parseInfostring,
    transformCode,
} from "../../examples";
import { type MarkdownEnv } from "../markdown-env";
import { getFingerprint } from "../../utils";
import { findTestId, highlight, htmlencode, replaceAtLink } from "./utils";

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

export function codePreview(
    options: CodePreviewOptions,
): (md: MarkdownIt) => void {
    const { generateExample } = options;

    return (md: MarkdownIt): void => {
        md.renderer.rules.fence = fence.bind(undefined, md);
    };

    function fence(
        _md: MarkdownIt,
        tokens: MarkdownIt.Token[],
        idx: number,
        _options: MarkdownIt.Options,
        env: MarkdownEnv,
    ): string {
        const { fileInfo } = env;
        const { content: rawSource, info, map } = tokens[idx];
        const { language, tags: rawTags } = parseInfostring(info);

        if (language === "mermaid") {
            return /* HTML */ `
                <pre class="mermaid">${htmlencode(rawSource)}</pre>
            `;
        }

        const source = transformCode(rawSource, language);

        const example = generateExample({
            source,
            language,
            filename: fileInfo.fullPath,
            tags: rawTags,
        });
        const { tags } = example;

        const hashContent = `${map?.[0]}:${map?.[1]}:${info}:${source}`;
        const fingerprint = getFingerprint(hashContent);
        const highlightedCode = replaceAtLink(highlight(example));
        const testId = findTestId(tags);
        const liveExample = tags.includes("live-example");
        const staticCode = example.runtime === false || tags.includes("static");
        const noMarkup = tags.includes("nomarkup");
        const fullscreen = tags.includes("fullscreen");
        const modifier = getClassModifier(tags);
        const standalonePath = getStandalonePath(example.output);
        const showFullscreen = Boolean(standalonePath) && fullscreen;
        const testIdAttr = testId ? `data-test="${testId}"` : "";
        const filteredTags = tags.filter((it) => {
            if (it.startsWith("test-id=")) {
                return false;
            }
            return true;
        });
        const dataTagsAttr =
            filteredTags.length > 0
                ? `data-tags=${filteredTags.join(" ")}`
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
