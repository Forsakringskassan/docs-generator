import { fs, vol } from "memfs";
import { beforeEach, describe, expect, it, vi } from "vitest";

/* @ts-expect-error -- technical debt: memfs is not 100% type compatible */
vi.mock(import("node:fs/promises"), () => {
    return {
        default: fs.promises,
    };
});

const { DependencyTree } = await import("./dependency-tree");

const cwd = "/project";
const cacheFolder = "/project/temp/docs";

let tree: InstanceType<typeof DependencyTree>;

beforeEach(() => {
    vol.reset();
    vol.fromJSON({
        "/project/package-lock.json": "lockfile",
        "/project/docs/foo.md": "",
        "/project/docs/foo.vue": "",
        "/project/docs/data.ts": "",
        "/project/docs/image.png": "",
    });
    tree = new DependencyTree({ cwd });
});

describe("getDependencies()", () => {
    it("should return empty list for unknown file", async () => {
        expect.assertions(1);
        await expect(tree.getDependencies("docs/foo.md")).resolves.toEqual([]);
    });

    it("should return direct dependencies", async () => {
        expect.assertions(1);
        tree.setFileDependencies("docs/foo.vue", ["docs/data.ts"]);
        await expect(tree.getDependencies("docs/foo.vue")).resolves.toEqual([
            "docs/data.ts",
        ]);
    });

    it("should return transitive dependencies", async () => {
        expect.assertions(2);
        tree.setDocumentResources("docs/foo.md", ["docs/image.png"]);
        tree.setExample("docs/foo.md", "example.js", ["docs/foo.vue"]);
        tree.setFileDependencies("docs/foo.vue", ["docs/data.ts"]);
        await expect(tree.getDependencies("docs/foo.md")).resolves.toEqual([
            "docs/data.ts",
            "docs/foo.vue",
            "docs/image.png",
        ]);
        await expect(tree.getDependencies("docs/foo.vue")).resolves.toEqual([
            "docs/data.ts",
        ]);
    });

    it("should handle cyclic dependencies", async () => {
        expect.assertions(2);
        tree.setFileDependencies("a.ts", ["b.ts"]);
        tree.setFileDependencies("b.ts", ["a.ts"]);
        await expect(tree.getDependencies("a.ts")).resolves.toEqual(["b.ts"]);
        await expect(tree.getDependencies("b.ts")).resolves.toEqual(["a.ts"]);
    });

    it("should deduplicate dependencies from multiple examples", async () => {
        expect.assertions(1);
        tree.setExample("docs/foo.md", "a.js", ["docs/data.ts"]);
        tree.setExample("docs/foo.md", "b.js", ["docs/data.ts"]);
        await expect(tree.getDependencies("docs/foo.md")).resolves.toEqual([
            "docs/data.ts",
        ]);
    });

    it("should ignore node_modules", async () => {
        expect.assertions(1);
        tree.setFileDependencies("docs/foo.vue", [
            "node_modules/vue/index.js",
            "docs/data.ts",
        ]);
        await expect(tree.getDependencies("docs/foo.vue")).resolves.toEqual([
            "docs/data.ts",
        ]);
    });

    it("should normalize absolute paths relative to cwd", async () => {
        expect.assertions(1);
        tree.setFileDependencies("/project/docs/foo.vue", [
            "/project/docs/data.ts",
        ]);
        await expect(tree.getDependencies("docs/foo.vue")).resolves.toEqual([
            "docs/data.ts",
        ]);
    });

    it("should normalize relative to given cwd", async () => {
        expect.assertions(1);
        const other = new DependencyTree({ cwd: "/other" });
        other.setFileDependencies("/other/foo.vue", ["/other/lib/data.ts"]);
        await expect(other.getDependencies("foo.vue")).resolves.toEqual([
            "lib/data.ts",
        ]);
    });

    describe("onlyNewer", () => {
        beforeEach(() => {
            tree.setFileDependencies("docs/foo.vue", [
                "docs/data.ts",
                "docs/image.png",
                "docs/missing.ts",
            ]);
            fs.utimesSync("/project/docs/foo.vue", 1000, 1000);
            fs.utimesSync("/project/docs/data.ts", 500, 500);
            fs.utimesSync("/project/docs/image.png", 2000, 2000);
        });

        it("should only include dependencies more recent than input file", async () => {
            expect.assertions(1);
            const result = await tree.getDependencies("docs/foo.vue", {
                onlyNewer: true,
            });
            expect(result).toEqual(["docs/image.png", "docs/missing.ts"]);
        });

        it("should include all dependencies by default", async () => {
            expect.assertions(1);
            const result = await tree.getDependencies("docs/foo.vue");
            expect(result).toHaveLength(3);
        });
    });
});

describe("getDependents()", () => {
    it("should return empty list for unknown file", async () => {
        expect.assertions(1);
        await expect(tree.getDependents("docs/data.ts")).resolves.toEqual([]);
    });

    it("should return transitive dependents", async () => {
        expect.assertions(3);
        tree.setDocumentResources("docs/foo.md", ["docs/image.png"]);
        tree.setExample("docs/foo.md", "example.js", ["docs/foo.vue"]);
        tree.setFileDependencies("docs/foo.vue", ["docs/data.ts"]);
        await expect(tree.getDependents("docs/foo.vue")).resolves.toEqual([
            "docs/foo.md",
        ]);
        await expect(tree.getDependents("docs/data.ts")).resolves.toEqual([
            "docs/foo.md",
            "docs/foo.vue",
        ]);
        await expect(tree.getDependents("docs/image.png")).resolves.toEqual([
            "docs/foo.md",
        ]);
    });

    it("should handle cyclic dependencies", async () => {
        expect.assertions(1);
        tree.setFileDependencies("a.ts", ["b.ts"]);
        tree.setFileDependencies("b.ts", ["a.ts"]);
        await expect(tree.getDependents("a.ts")).resolves.toEqual(["b.ts"]);
    });
});

describe("persistence", () => {
    function populate(it: InstanceType<typeof DependencyTree>): void {
        it.setDocumentResources("docs/foo.md", ["docs/image.png"]);

        it.setExample("docs/foo.md", "example.js", ["docs/foo.vue"]);

        it.setFileDependencies("docs/foo.vue", ["docs/data.ts"]);
    }

    it("should restore saved state", async () => {
        expect.assertions(2);
        populate(tree);
        await tree.save(cacheFolder);
        const loaded = await DependencyTree.load(cacheFolder, { cwd });
        expect(loaded.hasExample("docs/foo.md", "example.js")).toBeTruthy();
        await expect(loaded.getDependencies("docs/foo.md")).resolves.toEqual([
            "docs/data.ts",
            "docs/foo.vue",
            "docs/image.png",
        ]);
    });

    it("should return empty tree if nothing is persisted", async () => {
        expect.assertions(1);
        const loaded = await DependencyTree.load(cacheFolder, { cwd });
        await expect(loaded.getDependencies("docs/foo.md")).resolves.toEqual(
            [],
        );
    });

    it("should return empty tree if persisted state is corrupt", async () => {
        expect.assertions(1);
        vol.fromJSON({ [`${cacheFolder}/dependency-tree.json`]: "{" });
        const loaded = await DependencyTree.load(cacheFolder, { cwd });
        expect(loaded.hasExample("docs/foo.md", "example.js")).toBeFalsy();
    });

    it("should invalidate if package-lock.json changes", async () => {
        expect.assertions(2);
        populate(tree);
        await tree.save(cacheFolder);
        const unchanged = await DependencyTree.load(cacheFolder, { cwd });
        expect(unchanged.hasExample("docs/foo.md", "example.js")).toBeTruthy();
        fs.writeFileSync("/project/package-lock.json", "changed");
        const changed = await DependencyTree.load(cacheFolder, { cwd });
        expect(changed.hasExample("docs/foo.md", "example.js")).toBeFalsy();
    });

    it("should invalidate if package-lock.json is removed", async () => {
        expect.assertions(1);
        populate(tree);
        await tree.save(cacheFolder);
        fs.unlinkSync("/project/package-lock.json");
        const loaded = await DependencyTree.load(cacheFolder, { cwd });
        expect(loaded.hasExample("docs/foo.md", "example.js")).toBeFalsy();
    });

    it("should drop entries not touched since load", async () => {
        expect.assertions(3);
        populate(tree);
        tree.setExample("docs/foo.md", "stale.js", ["docs/stale.ts"]);
        tree.setFileDependencies("docs/stale.ts", ["docs/other.ts"]);
        await tree.save(cacheFolder);

        const loaded = await DependencyTree.load(cacheFolder, { cwd });
        loaded.touchExample("docs/foo.md", "example.js");
        loaded.setDocumentResources("docs/foo.md", ["docs/image.png"]);
        await loaded.save(cacheFolder);

        const reloaded = await DependencyTree.load(cacheFolder, { cwd });
        expect(reloaded.hasExample("docs/foo.md", "example.js")).toBeTruthy();
        expect(reloaded.hasExample("docs/foo.md", "stale.js")).toBeFalsy();
        await expect(reloaded.getDependents("docs/other.ts")).resolves.toEqual(
            [],
        );
    });
});
