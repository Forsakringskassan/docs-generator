import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { type RenderOptions } from "./render-options";

interface SerializedTreeV1 {
    version: 1;
    tree: Record<string, string[]>;
}

const filename = ".dependency-tree.json";

function replacer(_key: string, value: unknown): unknown {
    if (value instanceof Map) {
        return Object.fromEntries(value.entries());
    }
    if (value instanceof Set) {
        return Array.from(value);
    }
    return value;
}

function isSerializedV1(value: unknown): value is SerializedTreeV1 {
    if (!value || typeof value !== "object") {
        return false;
    }
    return "version" in value && value.version === 1;
}

function parse(value: string): Map<string, Set<string>> {
    try {
        const parsed = JSON.parse(value);
        if (isSerializedV1(parsed)) {
            return new Map(
                Object.entries(parsed.tree).map(([filePath, dependencies]) => {
                    return [filePath, new Set(dependencies)];
                }),
            );
        }
        return new Map();
    } catch {
        return new Map();
    }
}

function serialize(dt: Map<string, Set<string>>): string {
    return JSON.stringify({ version: 1, tree: dt }, replacer, 2);
}

/**
 * Utility class to keep track of build output dependencies.
 *
 * @internal
 */
export class DependencyTree {
    private readonly filePath: string;
    private tree: Map<string, Set<string>>;

    public constructor(options: Pick<RenderOptions, "cacheFolder">) {
        this.filePath = path.join(options.cacheFolder, filename);
        console.log(this.filePath);
        this.tree = new Map();
    }

    public update(filePath: string, dependencies: Set<string>): void {
        this.tree.set(filePath, new Set(dependencies));
    }

    public merge(tree: Map<string, Set<string>>): void {
        for (const [filePath, dependencies] of tree.entries()) {
            this.update(filePath, dependencies);
        }
    }

    public async load(): Promise<void> {
        if (existsSync(this.filePath)) {
            console.log("loading existing dependency tree");
            const content = await fs.readFile(this.filePath, "utf-8");
            this.tree = parse(content);
        } else {
            console.log("skipping loading existing dependency tree");
        }
    }

    public async save(): Promise<void> {
        const content = serialize(this.tree);
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.writeFile(this.filePath, content, "utf-8");
    }

    public getDependenciesFor(
        filePath: string | null,
        options: { recursive?: boolean } = {},
    ): Set<string> {
        const { recursive = false } = options;
        if (!filePath) {
            return new Set();
        }
        const dependencies = new Set(this.tree.get(filePath));
        if (recursive) {
            for (const dependency of dependencies) {
                for (const nested of this.getDependenciesFor(
                    dependency,
                    options,
                )) {
                    dependencies.add(nested);
                }
            }
        }
        return dependencies;
    }
}
