import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { build } from "esbuild";
import { afterAll, beforeAll, expect, it } from "vitest";
import { virtualEntryPlugin } from "../esbuild";
import {
    type ExtractedDependencies,
    extractDependencies,
} from "./extract-dependencies";
import { vuePlugin } from "plugin-vue3";

let cwd: string;

beforeAll(async () => {
    /* esbuild reads from the real filesystem so memfs cannot be used here */
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "deps-"));
    cwd = await fs.realpath(tmp);
    await fs.mkdir(path.join(cwd, "docs"));
    await fs.writeFile(
        path.join(cwd, "docs/data.ts"),
        `export const data = "data";\n`,
    );
    await fs.writeFile(
        path.join(cwd, "docs/Child.vue"),
        `<template><span>child</span></template>\n`,
    );
    await fs.writeFile(
        path.join(cwd, "docs/Foo.vue"),
        [
            `<script setup lang="ts">`,
            `import { data } from "./data";`,
            `import Child from "./Child.vue";`,
            `</script>`,
            `<template><Child>{{ data }}</Child></template>`,
            ``,
        ].join("\n"),
    );
});

afterAll(async () => {
    await fs.rm(cwd, { recursive: true, force: true });
});

const entry = "virtual:docs/foo.md:example.js";

async function compile(source: string): Promise<ExtractedDependencies> {
    const { metafile } = await build({
        absWorkingDir: cwd,
        entryPoints: [{ in: entry, out: "example" }],
        outdir: path.join(cwd, "out"),
        write: false,
        metafile: true,
        bundle: true,
        format: "esm",
        external: ["vue"],
        plugins: [virtualEntryPlugin({ [entry]: source }), vuePlugin()],
    });
    return extractDependencies(metafile, cwd);
}

function relative(filePath: string): string {
    return path.relative(cwd, filePath).replaceAll("\\", "/");
}

function sorted(list: string[]): string[] {
    return list.toSorted((a, b) => a.localeCompare(b));
}

function relativize(result: ExtractedDependencies): ExtractedDependencies {
    const entries = Object.entries(result.files).map(([file, deps]) => {
        return [relative(file), sorted(deps.map(relative))];
    });
    return {
        entry: sorted(result.entry.map(relative)),
        files: Object.fromEntries(entries),
    };
}

it("should extract imports of the entry point", async () => {
    expect.assertions(1);
    const result = await compile(
        `import { data } from "./data";\nimport "vue";\nconsole.log(data);`,
    );
    expect(relativize(result)).toEqual({
        entry: ["docs/data.ts"],
        files: { "docs/data.ts": [] },
    });
});

it("should extract transitive imports from vue files", async () => {
    expect.assertions(1);
    const result = await compile(
        `import Foo from "./Foo.vue";\nconsole.log(Foo);`,
    );
    expect(relativize(result)).toEqual({
        entry: ["docs/Foo.vue"],
        files: {
            "docs/Child.vue": [],
            "docs/Foo.vue": ["docs/Child.vue", "docs/data.ts"],
            "docs/data.ts": [],
        },
    });
});
