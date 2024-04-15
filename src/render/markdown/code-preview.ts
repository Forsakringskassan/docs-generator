import type MarkdownIt from "markdown-it";
import { type ExampleResult } from "../../examples";
import { type MarkdownEnv } from "../markdown-env";
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
        const { content: source } = tokens[idx];
        const { info } = tokens[idx];
        const [language, ...rawTags] = info.split(/\s+/);

        if (language === "mermaid") {
            return /* HTML */ `
                <pre class="mermaid">${htmlencode(source)}</pre>
            `;
        }

        const example = generateExample({
            source,
            language,
            filename: fileInfo.fullPath,
            tags: rawTags,
        });
        const { tags } = example;

        const highlightedCode = replaceAtLink(highlight(example));
        const testId = findTestId(tags);
        const liveExample = tags.includes("live-example");
        const staticCode = example.runtime === false || tags.includes("static");
        const noMarkup = tags.includes("nomarkup");
        const fullscreen = tags.includes("fullscreen");
        const modifier = getClassModifier(tags);
        const standalone = Boolean(example.output) && fullscreen;
        const testIdAttr = testId ? ` data-test="${testId}"` : "";

        if (liveExample) {
            return /* HTML */ `
                <div
                    class="code-preview code-preview--borderless"
                    ${testIdAttr}
                >
                    ${example.markup}
                </div>
            `;
        }

        if (staticCode) {
            return /* HTML */ `
                <div class="code-preview ${modifier}" ${testIdAttr}>
                    ${example.comments.join("\n")}
                    <pre class="code-preview__markup">${highlightedCode}</pre>
                </div>
            `;
        }

        if (noMarkup) {
            return /* HTML */ `
                <div class="code-preview ${modifier}" ${testIdAttr}>
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

        const toggleFullscreen = fullscreen
            ? /* HTML */ `
                  <a href="${standalone}" class="code-preview__fullscreen">
                      <i class="icon icon--fullscreen"></i>
                      Helskärm
                  </a>
              `
            : "";

        return /* HTML */ `
            <div class="code-preview ${modifier}" ${testIdAttr}>
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
