import { type Processor } from "./processor";
import { type ProcessorStage } from "./processor-stage";

const stages = ["generate-docs", "generate-nav", "assets", "render"] as const;

/* Each stage has three consecutive buckets: before, during and after. */
const positions = ["before", "during", "after"] as const;
const BEFORE = 0;
const DURING = 1;
const AFTER = 2;

/**
 * @internal
 */
export class ProcessorOrderError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "ProcessorOrderError";
    }
}

interface Node {
    readonly processor: Processor;
    /** Lowest allowed bucket from stage names (or -1) */
    lowest: number;
    /** Highest allowed bucket from stage names (or Infinity) */
    highest: number;
    /** Stage-name constraints as written by the user (for error messages) */
    constraints: string[];
    /** Nodes which must run before this one */
    predecessors: Set<Node>;
    /** Nodes which must run after this one */
    successors: Set<Node>;
    /** Preferred bucket before dependencies are taken into account */
    target: number | null;
    /** Resolved bucket */
    bucket: number;
    /** Position in topological order */
    position: number;
}

function toArray<T>(value: T | T[] | undefined): T[] {
    if (value === undefined) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function isStage(value: string): value is ProcessorStage {
    return (stages as readonly string[]).includes(value);
}

function quote(value: string): string {
    return `"${value}"`;
}

function bucketName(bucket: number): string {
    const stage = stages[Math.floor(bucket / 3)];
    return `${positions[bucket % 3]} ${quote(stage)}`;
}

function conflict(processor: Processor, message: string): ProcessorOrderError {
    return new ProcessorOrderError(
        `Conflicting order for processor ${quote(processor.name)}: ${message}`,
    );
}

function validateStage(
    processor: Processor,
    stage: string,
    byName: Map<string, Node[]>,
): void {
    if (isStage(stage)) {
        return;
    }
    const expected = stages.map((it) => quote(it)).join(", ");
    const hint = byName.has(stage)
        ? ` ${quote(stage)} is a processor, use "before" or "after" to order relative to another processor.`
        : "";
    throw conflict(
        processor,
        `"stage" must be one of ${expected} but got ${quote(stage)}.${hint}`,
    );
}

function addStageBound(
    node: Node,
    position: number,
    key: "before" | "after" | "stage",
    stage: ProcessorStage,
): void {
    const bucket = stages.indexOf(stage) * 3 + position;
    if (key !== "before") {
        node.lowest = Math.max(node.lowest, bucket);
    }
    if (key !== "after") {
        node.highest = Math.min(node.highest, bucket);
    }
    node.constraints.push(`${key}: ${quote(stage)}`);
}

function createNode(this: void, processor: Processor): Node {
    return {
        processor,
        lowest: -1,
        highest: Infinity,
        constraints: [],
        predecessors: new Set(),
        successors: new Set(),
        target: null,
        bucket: 0,
        position: 0,
    };
}

function addReferences(
    node: Node,
    key: "before" | "after",
    byName: Map<string, Node[]>,
): void {
    const { processor } = node;
    const names = toArray(processor[key]);
    for (const name of names) {
        if (name === processor.name) {
            throw conflict(processor, `"${key}" refers to itself.`);
        }
        if (isStage(name)) {
            addStageBound(node, key === "before" ? BEFORE : AFTER, key, name);
            continue;
        }
        /* missing processors are ignored */
        const others = byName.get(name) ?? [];
        for (const other of others) {
            const [pred, succ] =
                key === "before" ? [node, other] : [other, node];
            succ.predecessors.add(pred);
            pred.successors.add(succ);
        }
    }
}

function createNodes(processors: Processor[]): Node[] {
    const byName = new Map<string, Node[]>();
    const nodes = processors.map(createNode);

    for (const node of nodes) {
        const list = byName.get(node.processor.name) ?? [];
        list.push(node);
        byName.set(node.processor.name, list);
    }

    for (const node of nodes) {
        const { processor } = node;
        const after = toArray(processor.after);

        for (const name of toArray(processor.before)) {
            if (after.includes(name)) {
                throw conflict(
                    processor,
                    `${quote(name)} is set in both "before" and "after".`,
                );
            }
        }

        if (processor.stage !== undefined) {
            /* runtime check, the type system does not allow other values */
            const stage: string = processor.stage;
            validateStage(processor, stage, byName);
            addStageBound(node, DURING, "stage", processor.stage);
        }

        addReferences(node, "before", byName);
        addReferences(node, "after", byName);

        if (node.lowest > node.highest) {
            throw conflict(
                processor,
                `${node.constraints.join(", ")} cannot all be satisfied.`,
            );
        }
    }
    return nodes;
}

function cycleError(remaining: Node[]): ProcessorOrderError {
    /* every remaining node has at least one remaining predecessor */
    const path: Node[] = [];
    let current = remaining[0];
    while (!path.includes(current)) {
        path.push(current);
        const pred = [...current.predecessors].find((it) =>
            remaining.includes(it),
        );
        if (!pred) {
            break;
        }
        current = pred;
    }
    const cycle = path.slice(path.indexOf(current)).toReversed();
    const names = [...cycle, cycle[0]].map((it) => quote(it.processor.name));
    return new ProcessorOrderError(
        `Circular processor order: ${names.join(" -> ")}.`,
    );
}

/**
 * Topological order, ties broken by original position. Throws if there is a
 * dependency cycle.
 */
function sortTopologically(nodes: Node[]): Node[] {
    const result: Node[] = [];
    const done = new Set<Node>();
    while (result.length < nodes.length) {
        const next = nodes.find((it) => {
            return (
                !done.has(it) && [...it.predecessors].every((p) => done.has(p))
            );
        });
        if (!next) {
            throw cycleError(nodes.filter((it) => !done.has(it)));
        }
        done.add(next);
        next.position = result.length;
        result.push(next);
    }
    return result;
}

/**
 * Preferred bucket for a node: from its own stage names if present, otherwise
 * the earliest of its dependents. Requires dependents to be handled first.
 */
function pickTarget(node: Node): number | null {
    if (node.lowest >= 0) {
        return node.lowest;
    }
    if (node.highest !== Infinity) {
        return node.highest;
    }
    const targets = [...node.successors]
        .map((it) => it.target)
        .filter((it) => it !== null);
    return targets.length > 0 ? Math.min(...targets) : null;
}

/**
 * Assign bucket, never earlier than any predecessor. Requires predecessors to
 * be handled first.
 */
function assignBucket(node: Node): void {
    /* missing dependencies leave a processor at the earliest bucket */
    let bucket = node.target ?? 0;
    let cause: Node | undefined;
    for (const pred of node.predecessors) {
        if (pred.bucket <= bucket) {
            continue;
        }

        bucket = pred.bucket;
        cause = pred;
    }
    if (bucket > node.highest && cause) {
        const dependency = quote(cause.processor.name);
        throw conflict(
            node.processor,
            `${node.constraints.join(", ")} but it must run after ${dependency} which runs ${bucketName(cause.bucket)}.`,
        );
    }
    node.bucket = bucket;
}

/**
 * Resolves the order processors run in for each stage.
 *
 * Disabled processors take part in the ordering but are not included in the
 * result.
 *
 * @internal
 */
export function resolveProcessorOrder(
    processors: Processor[],
): Record<ProcessorStage, Processor[]> {
    const nodes = createNodes(processors);
    const sorted = sortTopologically(nodes);

    for (const node of sorted.toReversed()) {
        node.target = pickTarget(node);
    }
    for (const node of sorted) {
        assignBucket(node);
    }

    const ordered = nodes.toSorted((a, b) => {
        return a.bucket - b.bucket || a.position - b.position;
    });

    const result: Record<ProcessorStage, Processor[]> = {
        "generate-docs": [],
        "generate-nav": [],
        assets: [],
        render: [],
    };
    for (const node of ordered) {
        if (node.processor.enabled === false) {
            continue;
        }
        const stage = stages[Math.floor(node.bucket / 3)];
        result[stage].push(node.processor);
    }
    return result;
}
