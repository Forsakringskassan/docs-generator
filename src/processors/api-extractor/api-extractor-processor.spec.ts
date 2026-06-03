import path from "node:path";
import { type Document, getDocumentBody } from "../../document";
import { type ProcessorContext } from "../../processor-context";
import { findDocument } from "../../utils";
import { type FindDocumentResult } from "../../utils/find-document";
import { apiExtractorProcessor } from "./api-extractor-processor";

const fixture = path.join(__dirname, "__fixtures__/model.api.json");
const duplicate = path.join(__dirname, "__fixtures__/duplicate.api.json");

function assertDocumentExists(
    result: FindDocumentResult,
): asserts result is Exclude<FindDocumentResult, { document: null }> {
    if (!result.document) {
        throw new TypeError("result.document is null");
    }
}

function toArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}

function noop(): void {
    /* do nothing */
}

function createMockContext(): ProcessorContext {
    const docs: Document[] = [];
    return {
        docs,
        log: jest.fn(),
        error: jest.fn(),
        addDocument(document) {
            for (const doc of toArray(document)) {
                docs.push(doc);
            }
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
        vendors: [],
        resources: [],
        outputFolder: "",
    } as ProcessorContext;
}

it("should add partials for each symbol", async () => {
    expect.assertions(4);
    const processor = apiExtractorProcessor({
        apiModel: [fixture],
    });
    const context = createMockContext();
    await processor.handler(context);
    expect(context.docs).toHaveLength(3);
    expect(context.docs).toContainEqual(
        expect.objectContaining({
            id: "@forsakringskassan/docs-generator!Foo:interface",
            name: "interface:Foo",
        }),
    );
    expect(context.docs).toContainEqual(
        expect.objectContaining({
            id: "@forsakringskassan/docs-generator!Bar:interface",
            name: "interface:Bar",
        }),
    );
    expect(context.docs).toContainEqual(
        expect.objectContaining({
            id: "@forsakringskassan/docs-generator!ExampleInterface:interface",
            name: "interface:ExampleInterface",
        }),
    );
});

it("should render interface", async () => {
    expect.assertions(1);
    const processor = apiExtractorProcessor({
        apiModel: [fixture],
    });
    const context = createMockContext();
    await processor.handler(context);
    const result = findDocument(context.docs, "interface:Foo");
    assertDocumentExists(result);
    const { document, kind, reference } = result;
    const body = getDocumentBody(document, [], { kind, reference });
    expect(body).toContain("interface Foo");
});

it("should throw error when name is ambiguous", async () => {
    expect.assertions(1);
    const processor = apiExtractorProcessor({
        /* load the same model twice to cause names to be ambiguous */
        apiModel: [fixture, duplicate],
    });
    const context = createMockContext();
    await processor.handler(context);
    const result = findDocument(context.docs, "interface:Foo");
    assertDocumentExists(result);
    const { document, kind, reference } = result;
    expect(() =>
        getDocumentBody(document, [], { kind, reference }),
    ).toThrowErrorMatchingInlineSnapshot(
        `"Ambiguous name "Foo", found 2 interfaces matching this name: "@forsakringskassan/docs-generator!Foo:interface" and "@forsakringskassan/docs-generator!Foo:interface""`,
    );
});
