import path from "node:path";
import { glob } from "glob";
import { beforeEach, expect, it, vi } from "vitest";
import { type Document } from "../document";
import { type ProcessorContext } from "../processor-context";
import { createMockDocument } from "../utils";
import { type FileReader } from "./file-reader";
import { fileReaderProcessor } from "./file-reader-processor";
import { type SourceFiles } from "./source-files";

vi.mock(import("glob"));

const fileReader = vi.fn<FileReader>().mockImplementation((filename) => {
    const { name } = path.parse(filename);
    return Promise.resolve([createMockDocument(name, filename)]);
});

function noop(): void {
    /* do nothing */
}

function toArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}

function createMockContext(): ProcessorContext {
    const docs: Document[] = [];
    return {
        docs,
        log: vi.fn(),
        error: vi.fn(),
        addDocument(document) {
            for (const doc of toArray(document)) {
                docs.push(doc);
            }
        },
        exampleFileMatcher() {
            return "";
        },
        topnav: {
            key: "root",
            title: "Root",
            path: "/",
            sortorder: 1,
            visible: true,
            children: [],
        },
        sidenav: {
            key: "root",
            title: "Root",
            path: "/",
            sortorder: 1,
            visible: true,
            children: [],
        },
        addResource: noop,
        addVendorAsset: noop,
        addTemplateBlock: noop,
        setSideNavigation: noop,
        setTemplateData: noop,
        setTopNavigation: noop,
        hasTemplate() {
            return false;
        },
        getTemplateData: noop,
        getAllTemplateBlocks() {
            return new Map();
        },
        getAllTemplateData() {
            return {
                assets: {},
                injectHead: [],
                injectBody: [],
            };
        },
        setState: noop,
        getState: noop,
        vendors: [],
        resources: [],
        outputFolder: "",
    } as ProcessorContext;
}

beforeEach(() => {
    vi.clearAllMocks();
});

it("should include all documents by default", async () => {
    expect.assertions(2);
    vi.mocked(glob).mockResolvedValue(["foo.md", "bar.md"]);
    const sourceFiles: SourceFiles[] = [{ include: "*.md", fileReader }];
    const context = createMockContext();
    const processor = fileReaderProcessor(sourceFiles);
    await processor.handler(context);
    expect(context.docs).toHaveLength(2);
    expect(context.docs).toEqual([
        expect.objectContaining({ name: "foo" }),
        expect.objectContaining({ name: "bar" }),
    ]);
});

it("should exclude documents rejected by filter", async () => {
    expect.assertions(2);
    vi.mocked(glob).mockResolvedValue(["foo.md", "bar.md"]);
    const filter = vi.fn((doc: Document) => doc.name === "foo");
    const sourceFiles: SourceFiles[] = [
        { include: "*.md", fileReader, filter },
    ];
    const context = createMockContext();
    const processor = fileReaderProcessor(sourceFiles);
    await processor.handler(context);
    expect(context.docs).toHaveLength(1);
    expect(context.docs).toEqual([expect.objectContaining({ name: "foo" })]);
});

it("should run filter before transform", async () => {
    expect.assertions(2);
    vi.mocked(glob).mockResolvedValue(["foo.md", "bar.md"]);
    const transform = vi.fn((doc: Document) => doc);
    const sourceFiles: SourceFiles[] = [
        {
            include: "*.md",
            fileReader,
            filter(doc) {
                return doc.name === "foo";
            },
            transform,
        },
    ];
    const context = createMockContext();
    const processor = fileReaderProcessor(sourceFiles);
    await processor.handler(context);
    expect(transform).toHaveBeenCalledTimes(1);
    expect(transform).toHaveBeenCalledWith(
        expect.objectContaining({
            name: "foo",
        }),
    );
});
