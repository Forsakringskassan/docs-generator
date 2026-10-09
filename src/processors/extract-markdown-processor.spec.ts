import { fs, vol } from "memfs";
import { beforeEach, expect, it, vi } from "vitest";
import { type Document, type DocumentPartial } from "../document";
import { type ProcessorContext } from "../processor-context";
import { createMockDocument } from "../utils/create-mock-document";
import { extractMarkdownProcessor } from "./extract-markdown-processor";
import { manifestState } from "./manifest-processor";

/* plugin-vue3 is built separately and not available when running unit tests in CI */
vi.mock(import("plugin-vue3"), () => ({}) as never);

/* @ts-expect-error -- technical debt: memfs is not 100% type compatible */
vi.mock(import("node:fs/promises"), () => {
    return {
        default: fs.promises,
    };
});

const partial: DocumentPartial = {
    kind: "partial",
    id: "mock:partial",
    name: "vue:Mock",
    alias: [],
    body: "<p>lorem ipsum</p>",
    format: "html",
    fileInfo: { fullPath: "/project/src/Mock.vue" },
};

function createContext(docs: Document[]): ProcessorContext {
    return {
        docs,
        getState(key: symbol) {
            return key === manifestState ? { pages: [] } : undefined;
        },
    } as unknown as ProcessorContext;
}

async function extract(body: string): Promise<{
    markdown: string;
    partials: unknown[];
}> {
    const page = createMockDocument("page", "/project/docs/page.md", {
        format: "markdown",
        body,
    });
    const processor = extractMarkdownProcessor({ outputFolder: "/out" });
    await processor.handler(createContext([page, partial]));
    const markdown = await fs.promises.readFile(
        "/out/files/project/docs/page.md",
        "utf8",
    );
    const partials = await fs.promises.readFile("/out/partials.json", "utf8");
    return {
        markdown: String(markdown),
        partials: JSON.parse(String(partials)) as unknown[],
    };
}

beforeEach(() => {
    vol.reset();
    vol.fromJSON({
        "/project/docs/page.md": "",
    });
});

it.each([
    ["LF", "\n"],
    ["CRLF", "\r\n"],
])("should replace api block with %s line endings", async (_, eol) => {
    expect.assertions(3);
    const body = ["::: api", "vue:Mock", ":::", ""].join(eol);
    const { markdown, partials } = await extract(body);
    expect(markdown).toMatch(/^partial:html:/m);
    expect(markdown).not.toContain("vue:Mock");
    expect(partials).toHaveLength(1);
});
