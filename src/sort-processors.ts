import { type Processor, type ProcessorDependency } from "./processor";
import { type ProcessorStage } from "./processor-stage";

export interface SortProcessorsOptions {
    /** Stop after the given virtual stage (used by `Generator.manifest()`) */
    until?: ProcessorStage;
}

interface DependencyGraph {
    edges: Map<string, Set<string>>;
    inDegree: Map<string, number>;
}

const VIRTUAL_STAGES: readonly ProcessorStage[] = [
    "generate-docs",
    "generate-nav",
    "assets",
    "render",
];

function toArray(dep?: ProcessorDependency): string[] {
    if (!dep) {
        return [];
    }
    return Array.isArray(dep) ? dep : [dep];
}

function isVirtualStage(name: string): name is ProcessorStage {
    return (VIRTUAL_STAGES as readonly string[]).includes(name);
}

function ensureNode(graph: DependencyGraph, id: string): void {
    if (graph.edges.has(id)) {
        return;
    }
    graph.edges.set(id, new Set());
    graph.inDegree.set(id, 0);
}

function addEdge(graph: DependencyGraph, from: string, to: string): void {
    if (from === to) {
        return;
    }
    ensureNode(graph, from);
    ensureNode(graph, to);
    const targets = graph.edges.get(from);
    if (!targets || targets.has(to)) {
        return;
    }
    targets.add(to);
    graph.inDegree.set(to, (graph.inDegree.get(to) ?? 0) + 1);
}

/* eslint-disable @typescript-eslint/no-deprecated -- support legacy stage property */
function addProcessorDependencies(
    graph: DependencyGraph,
    proc: Processor,
    knownProcessors: ReadonlySet<string>,
): void {
    ensureNode(graph, proc.name);

    if (proc.stage && isVirtualStage(proc.stage)) {
        addEdge(graph, `${proc.stage}:start`, proc.name);
        addEdge(graph, proc.name, `${proc.stage}:end`);
    }
    /* eslint-enable @typescript-eslint/no-deprecated */
    for (const target of toArray(proc.before)) {
        if (isVirtualStage(target)) {
            addEdge(graph, proc.name, `${target}:start`);
        } else if (knownProcessors.has(target)) {
            addEdge(graph, proc.name, target);
        }
    }

    for (const target of toArray(proc.after)) {
        if (isVirtualStage(target)) {
            addEdge(graph, `${target}:end`, proc.name);
        } else if (knownProcessors.has(target)) {
            addEdge(graph, target, proc.name);
        }
    }
}

function findExcludedNodes(
    graph: DependencyGraph,
    until?: ProcessorStage,
): Set<string> {
    const excluded = new Set<string>();
    if (!until) {
        return excluded;
    }

    const skipQueue = [`${until}:end`];
    while (skipQueue.length > 0) {
        const node = skipQueue.shift();
        if (!node || excluded.has(node)) {
            continue;
        }
        excluded.add(node);
        const neighbors = graph.edges.get(node) ?? [];
        for (const next of neighbors) {
            skipQueue.push(next);
        }
    }

    return excluded;
}

/**
 * Sort processors topologically based on `before`, `after` and `stage`.
 * Unknown processor names are ignored.
 *
 * @internal
 */
export function sortProcessors(
    processors: Processor[],
    options?: SortProcessorsOptions,
): Processor[] {
    const enabled = processors.filter((p) => p.enabled !== false);
    const processorMap = new Map(enabled.map((p) => [p.name, p]));
    const knownProcessors = new Set(processorMap.keys());

    const graph: DependencyGraph = {
        edges: new Map(),
        inDegree: new Map(),
    };

    for (let i = 0; i < VIRTUAL_STAGES.length; i++) {
        const current = VIRTUAL_STAGES[i];
        addEdge(graph, `${current}:start`, `${current}:end`);
        if (i >= VIRTUAL_STAGES.length - 1) {
            continue;
        }
        const next = VIRTUAL_STAGES[i + 1];
        addEdge(graph, `${current}:end`, `${next}:start`);
    }

    for (const proc of enabled) {
        addProcessorDependencies(graph, proc, knownProcessors);
    }

    const excluded = findExcludedNodes(graph, options?.until);
    const queue = Array.from(graph.inDegree)
        .filter(([, degree]) => degree === 0)
        .map(([node]) => node);

    const sorted: Processor[] = [];
    let visitedCount = 0;

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
            continue;
        }
        visitedCount++;

        const proc = processorMap.get(current);
        if (proc && !excluded.has(current)) {
            sorted.push(proc);
        }

        const neighbors = graph.edges.get(current) ?? [];
        for (const neighbor of neighbors) {
            const nextDegree = (graph.inDegree.get(neighbor) ?? 0) - 1;
            graph.inDegree.set(neighbor, nextDegree);
            if (nextDegree === 0) {
                queue.push(neighbor);
            }
        }
    }

    if (visitedCount !== graph.edges.size) {
        const circular = Array.from(graph.inDegree)
            .filter(([node, degree]) => degree > 0 && processorMap.has(node))
            .map(([node]) => node);
        throw new Error(
            `Circular dependency detected among processors: ${circular.join(", ")}`,
        );
    }

    return sorted;
}
