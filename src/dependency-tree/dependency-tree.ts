import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const stateFilename = "dependency-tree.json";
const lockfileName = "package-lock.json";
const stateVersion = 1;

interface ExampleEntry {
    parent: string;
    dependencies: string[];
}

interface PersistedState {
    version: number;
    lockfileHash: string | null;
    files: Record<string, string[]>;
    resources: Record<string, string[]>;
    examples: Record<string, ExampleEntry>;
}

/**
 * @internal
 */
export interface DependencyTreeOptions {
    /** Working directory, all paths are stored relative to this directory */
    cwd: string;
}

/**
 * @internal
 */
export interface DependencyLookupOptions {
    /** If set only dependencies more recent than the input file are returned */
    onlyNewer?: boolean;
}

type Graph = Map<string, Set<string>>;

function addEdge(graph: Graph, from: string, to: string): void {
    const edges = graph.get(from);
    if (edges) {
        edges.add(to);
    } else {
        graph.set(from, new Set([to]));
    }
}

function traverse(graph: Graph, start: string): string[] {
    const visited = new Set<string>();
    const queue = [start];
    while (queue.length > 0) {
        const current = queue.pop();
        if (current === undefined) {
            break;
        }
        const edges = graph.get(current) ?? [];
        for (const next of edges) {
            if (next === start || visited.has(next)) {
                continue;
            }
            visited.add(next);
            queue.push(next);
        }
    }
    return Array.from(visited).toSorted((a, b) => a.localeCompare(b));
}

async function getLockfileHash(cwd: string): Promise<string | null> {
    try {
        const content = await fs.readFile(path.join(cwd, lockfileName));
        return crypto.createHash("sha256").update(content).digest("hex");
    } catch {
        return null;
    }
}

async function getMtime(filePath: string): Promise<number | null> {
    try {
        const stats = await fs.stat(filePath);
        return stats.mtimeMs;
    } catch {
        return null;
    }
}

/**
 * Tracks which resources each source file depends on.
 *
 * Dependencies are collected from three sources:
 *
 * - imports between files (reported by esbuild when compiling examples),
 * - resources (e.g. images) referenced by a document,
 * - examples compiled from a document.
 *
 * @internal
 */
export class DependencyTree {
    private readonly cwd: string;
    private readonly files = new Map<string, string[]>();
    private readonly resources = new Map<string, string[]>();
    private readonly examples = new Map<string, ExampleEntry>();
    private readonly touchedExamples = new Set<string>();
    private readonly touchedResources = new Set<string>();

    public constructor(options: DependencyTreeOptions) {
        this.cwd = options.cwd;
    }

    /**
     * Load persisted state from `cacheFolder`. If there is no state, the state
     * is unreadable or `package-lock.json` has changed an empty tree is
     * returned.
     */
    public static async load(
        cacheFolder: string,
        options: DependencyTreeOptions,
    ): Promise<DependencyTree> {
        const tree = new DependencyTree(options);
        let state: PersistedState;
        try {
            const content = await fs.readFile(
                path.join(cacheFolder, stateFilename),
                "utf8",
            );
            state = JSON.parse(content) as PersistedState;
        } catch {
            return tree;
        }

        const lockfileHash = await getLockfileHash(options.cwd);
        if (
            state.version !== stateVersion ||
            state.lockfileHash !== lockfileHash
        ) {
            return tree;
        }

        for (const [file, deps] of Object.entries(state.files)) {
            tree.files.set(file, deps);
        }
        for (const [doc, deps] of Object.entries(state.resources)) {
            tree.resources.set(doc, deps);
        }
        for (const [key, entry] of Object.entries(state.examples)) {
            tree.examples.set(key, entry);
        }
        return tree;
    }

    /**
     * Persist state to `cacheFolder`. Entries not updated since the tree was
     * loaded are dropped.
     */
    public async save(cacheFolder: string): Promise<void> {
        const examples = Array.from(this.examples).filter(([key]) =>
            this.touchedExamples.has(key),
        );
        const resources = Array.from(this.resources).filter(([doc]) =>
            this.touchedResources.has(doc),
        );

        /* only keep import edges still reachable from something we keep */
        const keep = new Set<string>();
        const queue = [
            ...examples.flatMap(([, it]) => it.dependencies),
            ...resources.flatMap(([, it]) => it),
        ];
        while (queue.length > 0) {
            const current = queue.pop();
            if (current === undefined || keep.has(current)) {
                continue;
            }
            keep.add(current);
            queue.push(...(this.files.get(current) ?? []));
        }
        const files = Array.from(this.files).filter(([file]) => keep.has(file));

        const state: PersistedState = {
            version: stateVersion,
            lockfileHash: await getLockfileHash(this.cwd),
            files: Object.fromEntries(files),
            resources: Object.fromEntries(resources),
            examples: Object.fromEntries(examples),
        };
        await fs.mkdir(cacheFolder, { recursive: true });
        await fs.writeFile(
            path.join(cacheFolder, stateFilename),
            JSON.stringify(state, null, 2),
            "utf8",
        );
    }

    /** Set the files imported by `file` (replaces previous value). */
    public setFileDependencies(file: string, dependencies: string[]): void {
        this.files.set(this.normalize(file), this.normalizeAll(dependencies));
    }

    /** Set resources (e.g. images) required by `document` (replaces previous value). */
    public setDocumentResources(document: string, resources: string[]): void {
        const key = this.normalize(document);
        this.resources.set(key, this.normalizeAll(resources));
        this.touchedResources.add(key);
    }

    /** Set direct dependencies of an example compiled from `parent`. */
    public setExample(
        parent: string,
        outputFile: string,
        dependencies: string[],
    ): void {
        const key = this.exampleKey(parent, outputFile);
        this.examples.set(key, {
            parent: this.normalize(parent),
            dependencies: this.normalizeAll(dependencies),
        });
        this.touchedExamples.add(key);
    }

    public hasExample(parent: string, outputFile: string): boolean {
        return this.examples.has(this.exampleKey(parent, outputFile));
    }

    /** Mark an example as still in use (without changing its dependencies). */
    public touchExample(parent: string, outputFile: string): void {
        this.touchedExamples.add(this.exampleKey(parent, outputFile));
    }

    /**
     * Get all resources required to build `file` (including transitive
     * dependencies).
     */
    public async getDependencies(
        file: string,
        options: DependencyLookupOptions = {},
    ): Promise<string[]> {
        const start = this.normalize(file);
        const dependencies = traverse(this.forwardGraph(), start);
        if (!options.onlyNewer) {
            return dependencies;
        }

        const reference = await getMtime(path.resolve(this.cwd, start));
        const newer = await Promise.all(
            dependencies.map(async (it) => {
                const mtime = await getMtime(path.resolve(this.cwd, it));
                const isNewer =
                    mtime === null || reference === null || mtime > reference;
                return isNewer ? it : null;
            }),
        );
        return newer.filter((it): it is string => it !== null);
    }

    /**
     * Get all source files which must be rebuilt if `file` changes (including
     * transitive dependents).
     */
    public getDependents(file: string): Promise<string[]> {
        const start = this.normalize(file);
        const reverse: Graph = new Map();
        for (const [from, edges] of this.forwardGraph()) {
            for (const to of edges) {
                addEdge(reverse, to, from);
            }
        }
        return Promise.resolve(traverse(reverse, start));
    }

    private forwardGraph(): Graph {
        const graph: Graph = new Map();
        for (const [file, deps] of [...this.files, ...this.resources]) {
            for (const dep of deps) {
                addEdge(graph, file, dep);
            }
        }
        for (const { parent, dependencies } of this.examples.values()) {
            for (const dep of dependencies) {
                addEdge(graph, parent, dep);
            }
        }
        return graph;
    }

    private exampleKey(parent: string, outputFile: string): string {
        return `${this.normalize(parent)}:${outputFile}`;
    }

    private normalize(filePath: string): string {
        const relative = path.isAbsolute(filePath)
            ? path.relative(this.cwd, filePath)
            : filePath;
        return path.posix.normalize(relative.replaceAll("\\", "/"));
    }

    private normalizeAll(filePaths: string[]): string[] {
        const normalized = filePaths
            .map((it) => this.normalize(it))
            .filter((it) => !it.split("/").includes("node_modules"));
        return Array.from(new Set(normalized)).toSorted((a, b) =>
            a.localeCompare(b),
        );
    }
}
