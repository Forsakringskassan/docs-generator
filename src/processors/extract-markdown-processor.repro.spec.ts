import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type Manifest } from "../manifest";
import { type ProcessorContext } from "../processor-context";
import { extractMarkdownProcessor } from "./extract-markdown-processor";
import { manifestState } from "./manifest-processor";

/*
 * Reproduction of `EBUSY: resource busy or locked, copyfile` seen on Windows
 * when many pages reference the same example file.
 *
 * This test intentionally uses the real file system (not memfs) as the error
 * only occurs when the OS locks real files. It only uses the public processor
 * API so it can run unchanged both before and after the fix.
 */

const pageCount = 200;
const fileCount = 5;

let tmp: string;

beforeEach(async () => {
    tmp = await fs.mkdtemp(path.join(os.tmpdir(), "ebusy-repro-"));
});

afterEach(async () => {
    await fs.rm(tmp, { recursive: true, force: true });
});

describe("extractMarkdownProcessor() with shared examples", () => {
    it("should not fail when many pages reference the same example files", async () => {
        expect.assertions(1);

        const sources: string[] = [];
        for (let i = 0; i < fileCount; i++) {
            const src = path.join(tmp, "src", `Example${i}.vue`);
            await fs.mkdir(path.dirname(src), { recursive: true });
            await fs.writeFile(
                src,
                `<template>${"x".repeat(1_000_000)}</template>`,
            );
            sources.push(src);
        }

        const manifest: Manifest = {
            pages: Array.from({ length: pageCount }, (_, i) => ({
                path: `page-${i}.html`,
                src: `page-${i}.md`,
                title: `page ${i}`,
                redirect: null,
                outline: [],
                examples: sources.map((src) => ({
                    src,
                    selector: "",
                    language: "vue",
                    tags: [],
                })),
            })),
        };

        const context = {
            docs: [],
            getState: (key: symbol) => {
                return key === manifestState ? manifest : undefined;
            },
        } as unknown as ProcessorContext;

        const processor = extractMarkdownProcessor({
            outputFolder: path.join(tmp, "dist"),
        });

        await expect(processor.handler?.(context)).resolves.toBeUndefined();
    });
});
