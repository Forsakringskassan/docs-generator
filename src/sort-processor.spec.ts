import { describe, expect, it } from "vitest";
import { type Processor } from "./processor";
import { sortProcessors } from "./sort-processors";

function createProcessor(
    options: Partial<Processor> & { name: string },
): Processor {
    return {
        ...options,
    };
}

function getNames(processors: Processor[]): string[] {
    return processors.map((it) => it.name);
}

describe("sortProcessors()", () => {
    it("should preserve registration order when there are no dependencies", () => {
        expect.assertions(1);
        const processors = [
            createProcessor({ name: "first" }),
            createProcessor({ name: "second" }),
            createProcessor({ name: "third" }),
        ];

        const result = sortProcessors(processors);
        expect(getNames(result)).toEqual(["first", "second", "third"]);
    });

    it("should order processors using before and after against other processors", () => {
        expect.assertions(1);
        const processors = [
            createProcessor({
                name: "extract-markdown-processor",
                after: "manifestProcessor",
            }),
            createProcessor({
                name: "manifestProcessor",
                after: "render",
            }),
            createProcessor({
                name: "early-processor",
                before: "manifestProcessor",
            }),
        ];

        const result = sortProcessors(processors);
        expect(getNames(result)).toEqual([
            "early-processor",
            "manifestProcessor",
            "extract-markdown-processor",
        ]);
    });

    it("should support virtual stages and legacy stage property", () => {
        expect.assertions(1);
        /* eslint-disable @typescript-eslint/no-deprecated -- testing backwards compatibility for stage */
        const processors = [
            createProcessor({ name: "after-render", after: "render" }),
            createProcessor({ name: "during-render", stage: "render" }),
            createProcessor({ name: "before-render", before: "render" }),
            createProcessor({ name: "after-assets", after: "assets" }),
            createProcessor({ name: "generate-docs", stage: "generate-docs" }),
        ];
        /* eslint-enable @typescript-eslint/no-deprecated */

        const result = sortProcessors(processors);
        expect(getNames(result)).toEqual([
            "generate-docs",
            "after-assets",
            "before-render",
            "during-render",
            "after-render",
        ]);
    });

    it("should ignore unknown processor names", () => {
        expect.assertions(1);
        const processors = [
            createProcessor({ name: "a", after: "foobar" }),
            createProcessor({ name: "b", before: ["render", "non-existent"] }),
        ];

        const result = sortProcessors(processors);
        expect(getNames(result)).toEqual(["a", "b"]);
    });

    it("should support arrays in before and after", () => {
        expect.assertions(1);
        const processors = [
            createProcessor({
                name: "final",
                after: ["step-a", "step-b"],
            }),
            createProcessor({
                name: "first",
                before: ["step-a", "step-b"],
            }),
            createProcessor({ name: "step-a" }),
            createProcessor({ name: "step-b" }),
        ];

        const result = sortProcessors(processors);
        expect(getNames(result)).toEqual([
            "first",
            "step-a",
            "step-b",
            "final",
        ]);
    });

    it("should support combining both before and after on the same processor", () => {
        expect.assertions(1);
        /* eslint-disable @typescript-eslint/no-deprecated -- testing backwards compatibility for stage */
        const processors = [
            createProcessor({ name: "manifest", after: "render" }),
            createProcessor({
                name: "middle",
                after: "generate-docs",
                before: "manifest",
            }),
            createProcessor({ name: "docs", stage: "generate-docs" }),
        ];
        /* eslint-enable @typescript-eslint/no-deprecated */

        const result = sortProcessors(processors);
        expect(getNames(result)).toEqual(["docs", "middle", "manifest"]);
    });

    it("should exclude disabled processors", () => {
        expect.assertions(1);
        const processors = [
            createProcessor({ name: "active" }),
            createProcessor({ name: "disabled", enabled: false }),
        ];

        const result = sortProcessors(processors);
        expect(getNames(result)).toEqual(["active"]);
    });

    it("should stop after specified stage when using until option", () => {
        expect.assertions(1);
        /* eslint-disable @typescript-eslint/no-deprecated -- testing backwards compatibility for stage */
        const processors = [
            createProcessor({ name: "docs", stage: "generate-docs" }),
            createProcessor({ name: "nav", stage: "generate-nav" }),
            createProcessor({ name: "renderer", stage: "render" }),
        ];
        /* eslint-enable @typescript-eslint/no-deprecated */

        const result = sortProcessors(processors, { until: "generate-docs" });
        expect(getNames(result)).toEqual(["docs"]);
    });

    it("should throw an error on circular dependencies", () => {
        expect.assertions(1);
        const processors = [
            createProcessor({ name: "a", after: "b" }),
            createProcessor({ name: "b", after: "a" }),
        ];

        expect(() => sortProcessors(processors)).toThrow(
            /Circular dependency detected among processors/,
        );
    });
});
