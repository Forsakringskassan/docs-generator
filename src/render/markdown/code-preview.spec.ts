import dedent from "dedent";
import markdownIt from "markdown-it";
import { format, resolveConfig } from "prettier";
import { describe, expect, it, vi } from "vitest";
import { type MarkdownEnv } from "../markdown-env";
import { codePreview } from "./code-preview";

vi.mock(import("./utils/highlight"), () => {
    return {
        highlight() {
            return "[ mocked code highlight ]";
        },
    };
});

expect.addSnapshotSerializer({
    test() {
        return true;
    },
    serialize: String,
});

const prettierConfig = await resolveConfig("code-preview.html");
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
                markup: "[ mocked example content ]",
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

async function renderMarkdown(source: string): Promise<string> {
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
    const markup = md.render(source, env);
    return await format(markup, {
        ...prettierConfig,
        filepath: "code-preview.html",
    });
}

it("should render html", async () => {
    expect.assertions(1);
    const source = dedent`
        \`\`\`html
        <p>Hello world!</p>
        \`\`\`
    `;
    const result = await renderMarkdown(source);
    expect(result).toMatchInlineSnapshot(`
      <div id="example-5ef093" class="code-preview code-preview--default" data-language="html">
          <div class="code-preview__preview user-background">[ mocked example content ]</div>
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
          <div class="code-preview__expand animate-expand" style="height: 0px" hidden>
              <pre class="code-preview__markup">[ mocked code highlight ]</pre>
          </div>
      </div>
    `);
});

describe("background tag", () => {
    it("should keep the default background when no background is configured", async () => {
        expect.assertions(1);
        const source = dedent`
	        \`\`\`html
	        <p>Hello world!</p>
	        \`\`\`
	    `;
        const result = await renderMarkdown(source);
        expect(result).toMatchInlineSnapshot(`
          <div id="example-5ef093" class="code-preview code-preview--default" data-language="html">
              <div class="code-preview__preview user-background">[ mocked example content ]</div>
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
              <div class="code-preview__expand animate-expand" style="height: 0px" hidden>
                  <pre class="code-preview__markup">[ mocked code highlight ]</pre>
              </div>
          </div>
        `);
    });

    it("should expose the solid background for a live example", async () => {
        expect.assertions(1);
        const source = dedent`
	        \`\`\`import live-example background=solid
	        LiveExample.vue
	        \`\`\`
	    `;
        const result = await renderMarkdown(source);
        expect(result).toMatchInlineSnapshot(`
          <div
              id="example-ad0bc6"
              class="code-preview code-preview--borderless"
              data-tags="live-example"
              data-background="solid"
              data-language="vue"
          >
              [ mocked example content ]
          </div>
        `);
    });

    it("should expose the solid background for a regular example", async () => {
        expect.assertions(1);
        const source = dedent`
 	       \`\`\`html background=solid
 	       <p>Hello world!</p>
 	       \`\`\`
 	   `;
        const result = await renderMarkdown(source);
        expect(result).toMatchInlineSnapshot(`
          <div id="example-23eb1c" class="code-preview code-preview--default" data-background="solid" data-language="html">
              <div class="code-preview__preview user-background">[ mocked example content ]</div>
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
              <div class="code-preview__expand animate-expand" style="height: 0px" hidden>
                  <pre class="code-preview__markup">[ mocked code highlight ]</pre>
              </div>
          </div>
        `);
    });

    it("should expose the solid background for an example without markup", async () => {
        expect.assertions(1);
        const source = dedent`
	        \`\`\`html nomarkup background=solid
	        <p>Hello world!</p>
	        \`\`\`
	    `;
        const result = await renderMarkdown(source);
        expect(result).toMatchInlineSnapshot(`
          <div
              id="example-b28477"
              class="code-preview code-preview--default"
              data-tags="nomarkup"
              data-background="solid"
              data-language="html"
          >
              <div class="code-preview__preview user-background">[ mocked example content ]</div>
          </div>
        `);
    });

    it("should not expose the solid background for static code", async () => {
        expect.assertions(1);
        const source = dedent`
	        \`\`\`html static background=solid
	        <p>Hello world!</p>
	        \`\`\`
	    `;
        const result = await renderMarkdown(source);
        expect(result).toMatchInlineSnapshot(`
          <div
              id="example-4b541e"
              class="code-preview code-preview--default"
              data-tags="static background=solid"
              data-language="html"
          >
              <pre class="code-preview__markup">[ mocked code highlight ]</pre>
          </div>
        `);
    });

    it("should not expose an unsupported background", async () => {
        expect.assertions(1);
        const source = dedent`
	        \`\`\`html background=brand
	        <p>Hello world!</p>
	        \`\`\`
	    `;
        const result = await renderMarkdown(source);
        expect(result).toMatchInlineSnapshot(`
          <div id="example-78a6aa" class="code-preview code-preview--default" data-tags="background=brand" data-language="html">
              <div class="code-preview__preview user-background">[ mocked example content ]</div>
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
              <div class="code-preview__expand animate-expand" style="height: 0px" hidden>
                  <pre class="code-preview__markup">[ mocked code highlight ]</pre>
              </div>
          </div>
        `);
    });
});

describe("borderless tag", () => {
    it("should not apply user background", async () => {
        expect.assertions(1);
        const source = dedent`
	        \`\`\`html nomarkup borderless
	        <p>Hello world!</p>
	        \`\`\`
	    `;
        const result = await renderMarkdown(source);
        expect(result).toMatchInlineSnapshot(`
          <div
              id="example-3b50f8"
              class="code-preview code-preview--borderless"
              data-tags="nomarkup borderless"
              data-language="html"
          >
              <div class="code-preview__preview">[ mocked example content ]</div>
          </div>
        `);
    });
});
