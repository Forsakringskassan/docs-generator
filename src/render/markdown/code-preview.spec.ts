/**
 * @vitest-environment jsdom
 */
import markdownIt from "markdown-it";
import { expect, it } from "vitest";
import { type MarkdownEnv } from "../markdown-env";
import { codePreview } from "./code-preview";

function render(tags: string, liveExample = true): HTMLElement {
    const md = markdownIt();
    md.use(
        codePreview({
            generateExample(options) {
                return {
                    source: options.source,
                    language: options.language,
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
                throw new Error("Unexpected import");
            },
        }),
    );
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
    const container = document.createElement("div");
    const infoTags = [liveExample ? "live-example" : "", tags]
        .filter(Boolean)
        .join(" ");
    container.innerHTML = md.render(
        `\`\`\`vue ${infoTags}\n<template />\n\`\`\``,
        env,
    );
    return container.querySelector<HTMLElement>(".code-preview")!;
}

it("should keep the default background when no background is configured", () => {
    expect.assertions(2);
    const element = render("");
    expect(element.dataset.exampleBackground).toBeUndefined();
    expect(element.dataset.tags).toBe("live-example");
});

it("should expose the solid background for a live example", () => {
    expect.assertions(2);
    const element = render("background=solid");
    expect(element.dataset.exampleBackground).toBe("solid");
    expect(element.dataset.tags).toBe("live-example");
});

it("should expose the solid background for a regular example", () => {
    expect.assertions(3);
    const element = render("background=solid", false);
    expect(element.dataset.exampleBackground).toBe("solid");
    expect(element.dataset.tags).toBeUndefined();
    expect(
        element.querySelector(".code-preview__preview.user-background"),
    ).toBeTruthy();
});

it("should not expose the solid background for static code", () => {
    expect.assertions(2);
    const element = render("static background=solid", false);
    expect(element.dataset.exampleBackground).toBeUndefined();
    expect(element.dataset.tags).toBe("static background=solid");
});

it.each(["background=page", "background=hotpink"])(
    "should not expose unsupported background %s",
    (background) => {
        expect.assertions(2);
        const element = render(background);
        expect(element.dataset.exampleBackground).toBeUndefined();
        expect(element.dataset.tags).toBe(`live-example ${background}`);
    },
);
