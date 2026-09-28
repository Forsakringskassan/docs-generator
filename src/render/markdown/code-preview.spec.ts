import dedent from "dedent";
import markdownIt from "markdown-it";
import { expect, it } from "vitest";
import { type MarkdownEnv } from "../markdown-env";
import { codePreview } from "./code-preview";

expect.addSnapshotSerializer({
    test() {
        return true;
    },
    serialize(value: string) {
        return dedent(value)
            .split(/\n/)
            .map((it) => it.trimEnd())
            .filter((it) => it.length > 0)
            .join("\n");
    },
});

const importedSource = "<template />";
const md = markdownIt();
md.use(
    codePreview({
        generateExample(options) {
            const imported = options.language === "import";
            return {
                source: imported ? importedSource : options.source,
                language: imported ? "vue" : options.language,
                comments: [],
                tags: options.tags,
                markup: options.tags.includes("live-example")
                    ? '<div class="live-example__example user-background">Example</div>'
                    : "<p>Example</p>",
                output: null,
                runtime: true,
                task: null,
            };
        },
        getImportedSource() {
            return importedSource;
        },
    }),
);

function renderMarkdown(source: string): string {
    const env: MarkdownEnv = {
        fileInfo: {
            fullPath: "example.md",
            name: "example",
            path: "",
            outputName: false,
        },
        ids: new Set(),
        currentHeading: 1,
        namedExamples: new Map(),
    };
    return md.render(source, env);
}

it("should keep the default background when no background is configured", () => {
    expect.assertions(1);
    const source = dedent`
        \`\`\`html
        <p>Hello world!</p>
        \`\`\`
    `;
    const result = renderMarkdown(source);
    expect(result).toMatchInlineSnapshot(`
      <div
             id="example-5ef093"
             class="code-preview code-preview--default"
             data-language="html"
         >
             <div class="code-preview__preview user-background">
                 <p>Example</p>
             </div>
             <div>
         <button
             type="button"
             class="code-preview__button code-preview__toggle-markup"
             aria-expanded="false"
             onclick="toggleMarkup(this)"
         >
             <svg focusable="false" class="docs-icon" aria-hidden="true">
                 <use href="#docs-icon-code"></use>
             </svg>
             Visa kod
         </button>
      </div>
             <div
                 class="code-preview__expand animate-expand"
                 style="height: 0px;"
                 hidden
             >
                 <pre class="code-preview__markup"><code class="hljs lang-html" tabindex="0"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Hello world!<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
      </code></pre>
             </div>
         </div>
    `);
});

it("should expose the solid background for a live example", () => {
    expect.assertions(1);
    const source = dedent`
        \`\`\`import live-example background=solid
        LiveExample.vue
        \`\`\`
    `;
    const result = renderMarkdown(source);
    expect(result).toMatchInlineSnapshot(`
      <div
          id="example-ad0bc6"
          class="code-preview code-preview--borderless"
          data-tags="live-example"
          data-background="solid"
          data-language="vue"
      >
          <div class="live-example__example user-background">Example</div>
      </div>
    `);
});

it("should expose the solid background for a regular example", () => {
    expect.assertions(1);
    const source = dedent`
        \`\`\`html background=solid
        <p>Hello world!</p>
        \`\`\`
    `;
    const result = renderMarkdown(source);
    expect(result).toMatchInlineSnapshot(`
      <div
             id="example-23eb1c"
             class="code-preview code-preview--default"
             data-background="solid"
             data-language="html"
         >
             <div class="code-preview__preview user-background">
                 <p>Example</p>
             </div>
             <div>
         <button
             type="button"
             class="code-preview__button code-preview__toggle-markup"
             aria-expanded="false"
             onclick="toggleMarkup(this)"
         >
             <svg focusable="false" class="docs-icon" aria-hidden="true">
                 <use href="#docs-icon-code"></use>
             </svg>
             Visa kod
         </button>
      </div>
             <div
                 class="code-preview__expand animate-expand"
                 style="height: 0px;"
                 hidden
             >
                 <pre class="code-preview__markup"><code class="hljs lang-html" tabindex="0"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Hello world!<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
      </code></pre>
             </div>
         </div>
    `);
});

it("should expose the solid background for an example without markup", () => {
    expect.assertions(1);
    const source = dedent`
        \`\`\`html nomarkup background=solid
        <p>Hello world!</p>
        \`\`\`
    `;
    const result = renderMarkdown(source);
    expect(result).toMatchInlineSnapshot(`
      <div
          id="example-b28477"
          class="code-preview code-preview--default"
          data-tags="nomarkup"
          data-background="solid"
          data-language="html"
      >
          <div class="code-preview__preview user-background">
              <p>Example</p>
          </div>
      </div>
    `);
});

it("should not expose the solid background for static code", () => {
    expect.assertions(1);
    const source = dedent`
        \`\`\`html static background=solid
        <p>Hello world!</p>
        \`\`\`
    `;
    const result = renderMarkdown(source);
    expect(result).toMatchInlineSnapshot(`
      <div
          id="example-4b541e"
          class="code-preview code-preview--default"
          data-tags="static background=solid"
          data-language="html"
      >
          <pre class="code-preview__markup"><code class="hljs lang-html" tabindex="0"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Hello world!<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
      </code></pre>
      </div>
    `);
});

it("should not expose an unsupported background", () => {
    expect.assertions(1);
    const source = dedent`
        \`\`\`html background=brand
        <p>Hello world!</p>
        \`\`\`
    `;
    const result = renderMarkdown(source);
    expect(result).toMatchInlineSnapshot(`
      <div
             id="example-78a6aa"
             class="code-preview code-preview--default"
             data-tags="background=brand"
             data-language="html"
         >
             <div class="code-preview__preview user-background">
                 <p>Example</p>
             </div>
             <div>
         <button
             type="button"
             class="code-preview__button code-preview__toggle-markup"
             aria-expanded="false"
             onclick="toggleMarkup(this)"
         >
             <svg focusable="false" class="docs-icon" aria-hidden="true">
                 <use href="#docs-icon-code"></use>
             </svg>
             Visa kod
         </button>
      </div>
             <div
                 class="code-preview__expand animate-expand"
                 style="height: 0px;"
                 hidden
             >
                 <pre class="code-preview__markup"><code class="hljs lang-html" tabindex="0"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Hello world!<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
      </code></pre>
             </div>
         </div>
    `);
});
