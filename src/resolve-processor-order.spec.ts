import { describe, expect, it } from "vitest";
import { type Processor } from "./processor";
import {
    ProcessorOrderError,
    resolveProcessorOrder,
} from "./resolve-processor-order";

function processor(name: string, order: Partial<Processor> = {}): Processor {
    return {
        name,
        ...order,
        handler() {
            /* do nothing */
        },
    };
}

function names(processors: Processor[]): string[] {
    return processors.map((it) => it.name);
}

function resolve(processors: Processor[]): Record<string, string[]> {
    const order = resolveProcessorOrder(processors);
    return {
        "generate-docs": names(order["generate-docs"]),
        "generate-nav": names(order["generate-nav"]),
        assets: names(order.assets),
        render: names(order.render),
    };
}

describe("stages", () => {
    it("should place processors before, during and after a stage", () => {
        expect.assertions(1);
        const result = resolve([
            processor("after", { after: "render" }),
            processor("during", { stage: "render" }),
            processor("before", { before: "render" }),
        ]);
        expect(result.render).toEqual(["before", "during", "after"]);
    });

    it("should preserve input order within the same position", () => {
        expect.assertions(1);
        const result = resolve([
            processor("a", { after: "assets" }),
            processor("b", { after: "assets" }),
            processor("c", { after: "assets" }),
        ]);
        expect(result.assets).toEqual(["a", "b", "c"]);
    });

    it("should run processors without ordering as early as possible", () => {
        expect.assertions(1);
        const result = resolve([processor("a"), processor("b")]);
        expect(result["generate-docs"]).toEqual(["a", "b"]);
    });

    it("should not include disabled processors", () => {
        expect.assertions(1);
        const result = resolve([
            processor("a", { stage: "render", enabled: false }),
            processor("b", { stage: "render" }),
        ]);
        expect(result.render).toEqual(["b"]);
    });

    it("should accept arrays", () => {
        expect.assertions(1);
        const result = resolve([
            processor("a", { after: ["generate-docs", "generate-nav"] }),
        ]);
        expect(result["generate-nav"]).toEqual(["a"]);
    });

    it("should combine before and after stages", () => {
        expect.assertions(2);
        const result = resolve([
            processor("a", { after: "generate-nav", before: "render" }),
        ]);
        expect(result["generate-nav"]).toEqual(["a"]);
        expect(result.render).toEqual([]);
    });

    it("should combine stage with before", () => {
        expect.assertions(1);
        const result = resolve([
            processor("a", { stage: "assets", before: "render" }),
        ]);
        expect(result.assets).toEqual(["a"]);
    });
});

describe("processor references", () => {
    it("should run after another processor in the same stage", () => {
        expect.assertions(1);
        const result = resolve([
            processor("a", { after: "b" }),
            processor("b", { stage: "assets" }),
        ]);
        expect(result.assets).toEqual(["b", "a"]);
    });

    it("should run before another processor in the same stage", () => {
        expect.assertions(1);
        const result = resolve([
            processor("a", { stage: "assets" }),
            processor("b", { before: "a" }),
        ]);
        expect(result.assets).toEqual(["b", "a"]);
    });

    it("should resolve chains", () => {
        expect.assertions(1);
        const result = resolve([
            processor("a", { after: "b" }),
            processor("b", { after: "c" }),
            processor("c", { after: "render" }),
        ]);
        expect(result.render).toEqual(["c", "b", "a"]);
    });

    it("should accept arrays of processors", () => {
        expect.assertions(1);
        const result = resolve([
            processor("a", { after: ["b", "c"] }),
            processor("b", { stage: "assets" }),
            processor("c", { stage: "render" }),
        ]);
        expect(result.render).toEqual(["c", "a"]);
    });

    it("should honour ordering relative to disabled processors", () => {
        expect.assertions(1);
        const result = resolve([
            processor("a", { after: "b" }),
            processor("b", { after: "c", enabled: false }),
            processor("c", { stage: "render" }),
        ]);
        expect(result.render).toEqual(["c", "a"]);
    });

    it("should run as early as possible if referenced processor is missing", () => {
        expect.assertions(1);
        const result = resolve([processor("a", { after: "missing" })]);
        expect(result["generate-docs"]).toEqual(["a"]);
    });

    it("should keep stage constraints if referenced processor is missing", () => {
        expect.assertions(1);
        const result = resolve([
            processor("a", { before: "render", after: "missing" }),
        ]);
        expect(result.render).toEqual(["a"]);
    });
});

describe("conflicts", () => {
    it("should throw if the same name is in before and after", () => {
        expect.assertions(2);
        const fn = (): unknown =>
            resolveProcessorOrder([
                processor("a", { before: "render", after: ["render"] }),
            ]);
        expect(fn).toThrow(ProcessorOrderError);
        expect(fn).toThrow(
            'Conflicting order for processor "a": "render" is set in both "before" and "after".',
        );
    });

    it("should throw if the same processor is in before and after", () => {
        expect.assertions(1);
        expect(() =>
            resolveProcessorOrder([
                processor("a", { before: "b", after: "b" }),
                processor("b"),
            ]),
        ).toThrow('"b" is set in both "before" and "after"');
    });

    it("should throw if stage is a processor name", () => {
        expect.assertions(1);
        expect(() =>
            resolveProcessorOrder([
                processor("a", { stage: "b" as never }),
                processor("b"),
            ]),
        ).toThrow(/"b" is a processor, use "before" or "after"/);
    });

    it("should throw if stage is unknown", () => {
        expect.assertions(1);
        expect(() =>
            resolveProcessorOrder([processor("a", { stage: "foo" as never })]),
        ).toThrow(/"stage" must be one of .* but got "foo"/);
    });

    it("should throw if processor refers to itself", () => {
        expect.assertions(1);
        expect(() =>
            resolveProcessorOrder([processor("a", { after: "a" })]),
        ).toThrow('"after" refers to itself');
    });

    it("should throw if stage constraints are impossible", () => {
        expect.assertions(1);
        expect(() =>
            resolveProcessorOrder([
                processor("a", { after: "render", before: "assets" }),
            ]),
        ).toThrow('before: "assets", after: "render" cannot all be satisfied');
    });

    it("should throw on circular dependencies", () => {
        expect.assertions(1);
        expect(() =>
            resolveProcessorOrder([
                processor("a", { after: "b" }),
                processor("b", { after: "c" }),
                processor("c", { after: "a" }),
            ]),
        ).toThrow('Circular processor order: "c" -> "b" -> "a" -> "c"');
    });

    it("should throw if dependencies conflict with stage", () => {
        expect.assertions(1);
        expect(() =>
            resolveProcessorOrder([
                processor("a", { before: "assets", after: "b" }),
                processor("b", { stage: "render" }),
            ]),
        ).toThrow(
            'before: "assets" but it must run after "b" which runs during "render"',
        );
    });
});
