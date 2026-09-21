import fs from "node:fs/promises";
import path from "node:path";
import { expect, it } from "vitest";

expect.addSnapshotSerializer({
    test(value) {
        return typeof value === "string";
    },
    serialize: String,
});

async function readFile(filename: string): Promise<string> {
    const filePath = path.join(import.meta.dirname, "dist", filename);
    return await fs.readFile(filePath, "utf8");
}

async function readJsonFile<T>(filename: string): Promise<T> {
    const content = await readFile(filename);
    return JSON.parse(content) as T;
}

async function generateTree(rootPath: string): Promise<string> {
    const lines: string[] = [];

    async function walk(
        currentPath: string,
        prefix: string,
        isLast: boolean,
    ): Promise<void> {
        const name = path.basename(currentPath);
        const connector = isLast ? "└── " : "├── ";

        if (name) {
            const line = prefix === "" ? "(root)" : prefix + connector + name;
            lines.push(line);
        }

        const stats = await fs.stat(currentPath);
        if (!stats.isDirectory()) {
            return;
        }

        const entries = await fs.readdir(currentPath);
        const sortedEntries = entries.toSorted((a, b) => a.localeCompare(b));

        const extension = isLast ? " ".repeat(4) : "│   ";
        const newPrefix = name ? prefix + extension : "";

        for (let i = 0; i < sortedEntries.length; i++) {
            const entryPath = path.join(currentPath, sortedEntries[i]!);
            const isLastEntry = i === sortedEntries.length - 1;
            await walk(entryPath, newPrefix, isLastEntry);
        }
    }

    await walk(rootPath, "", true);
    return lines.join("\n");
}

it("should generate files", async () => {
    expect.assertions(1);
    const tree = await generateTree(path.join(import.meta.dirname, "dist"));
    expect(tree).toMatchInlineSnapshot(`
      (root)
          ├── files
          │   ├── docs
          │   │   ├── foo
          │   │   │   └── index.md
          │   │   ├── index.md
          │   │   ├── with-example.md
          │   │   └── with-partial.md
          │   └── src
          │       └── AwesomeExample.vue
          ├── index.d.mts
          ├── index.mjs
          ├── links.json
          └── partials.json
    `);
});

it("should generate links.json", async () => {
    expect.assertions(1);
    const parsed = await readJsonFile<object>("links.json");
    expect(Object.keys(parsed).length).toBeGreaterThan(0);
});

it("should generate partials.json", async () => {
    expect.assertions(1);
    const parsed = await readJsonFile<unknown[]>("partials.json");
    expect(parsed.length).toBeGreaterThan(0);
});

it("should generate a matching partial in markdown and partials.json", async () => {
    expect.assertions(2);
    const markdown = await readFile("files/docs/with-partial.md");
    const partials = await readJsonFile<Array<{ id: string }>>("partials.json");
    const references = Array.from(
        markdown.matchAll(/^partial:.*$/gm),
        (m) => m[0],
    );
    expect(references).toHaveLength(1);
    const item = partials.find((it) => it.id === references[0]);
    expect(item).toEqual({
        body: expect.any(String),
        format: "html",
        id: references[0],
    });
});
