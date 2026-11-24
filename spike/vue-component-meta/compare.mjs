/* Spike only: compares the component API extracted by two implementations
 * for a set of Vue SFCs:
 *
 * - `docgen`: vue-docgen-api, the current implementation (kept in
 *   ./translate-api-docgen.ts)
 * - `meta`: the vue-component-meta prototype on this branch
 * - `refactor`: the earlier `origin/refactor/vue-component-meta` attempt
 *   (kept in ./translate-api-refactor.ts)
 *
 * Usage:
 *
 *   node spike/vue-component-meta/compare.mjs <out-dir> <root> <include...>
 *     [--exclude <glob>...] [--tsconfig <path>]
 *     [--baseline docgen|meta|refactor] [--candidate docgen|meta|refactor]
 *
 * Example (FKUI):
 *
 *   node spike/vue-component-meta/compare.mjs temp/compare ../designsystem \
 *     "packages/vue/src/components/**\/*.vue" \
 *     --exclude "**\/examples/*.vue" --exclude "**\/ct/*.vue"
 */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";
import esbuild from "esbuild";

const spikeDir = import.meta.dirname;

function parseArgs(argv) {
    const [outDir, root, ...rest] = argv;
    const include = [];
    const exclude = [];
    let tsconfig;
    let baseline = "docgen";
    let candidate = "meta";
    for (let index = 0; index < rest.length; index++) {
        const arg = rest[index];
        if (arg === "--exclude") {
            exclude.push(rest[++index]);
        } else if (arg === "--tsconfig") {
            tsconfig = rest[++index];
        } else if (arg === "--baseline") {
            baseline = rest[++index];
        } else if (arg === "--candidate") {
            candidate = rest[++index];
        } else {
            include.push(arg);
        }
    }
    return { outDir, root, include, exclude, tsconfig, baseline, candidate };
}

async function loadImplementations(outDir) {
    const entry = path.join(outDir, "entry.ts");
    await fs.writeFile(
        entry,
        [
            `export { translateAPI } from ${JSON.stringify(path.resolve(spikeDir, "../../src/file-reader/vue-file-reader/translate-api.ts"))};`,
            `export { translateAPIDocgen } from ${JSON.stringify(path.resolve(spikeDir, "translate-api-docgen.ts"))};`,
            `export { translateAPIRefactor } from ${JSON.stringify(path.resolve(spikeDir, "translate-api-refactor.ts"))};`,
            `export { resolveTsconfig } from ${JSON.stringify(path.resolve(spikeDir, "../../src/file-reader/vue-file-reader/component-meta-checker.ts"))};`,
        ].join("\n"),
    );
    const outfile = path.join(outDir, "implementations.mjs");
    await esbuild.build({
        entryPoints: [entry],
        outfile,
        bundle: true,
        platform: "node",
        format: "esm",
        packages: "external",
        logLevel: "warning",
        plugins: [
            {
                /* `src/utils` pulls in a worker via a Vite style import,
                 * not needed to extract component APIs */
                name: "stub-worker-url",
                setup(build) {
                    build.onResolve({ filter: /\?worker&url$/ }, (args) => ({
                        path: args.path,
                        namespace: "stub-worker-url",
                    }));
                    build.onLoad(
                        { filter: /.*/, namespace: "stub-worker-url" },
                        () => ({
                            contents: `export default "";`,
                            loader: "js",
                        }),
                    );
                },
            },
        ],
    });
    return import(pathToFileURL(path.resolve(outfile)).href);
}

/* vue-docgen-api prints defaults with CRLF on Windows, not a real difference */
function normalizeEol(value) {
    /* matches the escaped `\r\n` in the JSON text */
    return JSON.parse(
        JSON.stringify(value ?? null).replaceAll(
            String.raw`\r\n`,
            String.raw`\n`,
        ),
    );
}

function byName(items) {
    return new Map(items.map((it) => [it.name, it]));
}

/**
 * Compare two lists of named items and return one change entry per field
 * that differs.
 */
function diffSection(section, oldItems, newItems) {
    const changes = [];
    const oldByName = byName(oldItems);
    const newByName = byName(newItems);
    for (const [name, oldItem] of oldByName) {
        const newItem = newByName.get(name);
        if (!newItem) {
            changes.push({ section, name, kind: "removed", old: oldItem });
            continue;
        }
        for (const field of Object.keys(oldItem)) {
            if (field === "name") {
                continue;
            }
            if (
                !isDeepStrictEqual(
                    normalizeEol(oldItem[field]),
                    normalizeEol(newItem[field]),
                )
            ) {
                changes.push({
                    section,
                    name,
                    kind: `${field} changed`,
                    old: oldItem[field],
                    new: newItem[field],
                });
            }
        }
    }
    for (const [name, newItem] of newByName) {
        if (!oldByName.has(name)) {
            changes.push({ section, name, kind: "added", new: newItem });
        }
    }
    const oldOrder = oldItems
        .map((it) => it.name)
        .filter((it) => newByName.has(it));
    const newOrder = newItems
        .map((it) => it.name)
        .filter((it) => oldByName.has(it));
    if (!isDeepStrictEqual(oldOrder, newOrder)) {
        changes.push({
            section,
            name: "*",
            kind: "order changed",
            old: oldOrder,
            new: newOrder,
        });
    }
    return changes;
}

function diffComponent(oldApi, newApi) {
    const changes = [];
    if (oldApi.name !== newApi.name) {
        changes.push({
            section: "component",
            name: "name",
            kind: "name changed",
            old: oldApi.name,
            new: newApi.name,
        });
    }
    for (const section of ["models", "props", "events", "slots"]) {
        changes.push(...diffSection(section, oldApi[section], newApi[section]));
    }
    return changes;
}

function formatValue(value) {
    if (value === undefined) {
        return "";
    }
    const text = typeof value === "string" ? value : JSON.stringify(value);
    return text.replaceAll("|", "\\|").replaceAll("\n", "⏎");
}

const { outDir, root, include, exclude, tsconfig, baseline, candidate } =
    parseArgs(process.argv.slice(2));
await fs.mkdir(outDir, { recursive: true });
const {
    translateAPI,
    translateAPIDocgen,
    translateAPIRefactor,
    resolveTsconfig,
} = await loadImplementations(outDir);

const implementations = {
    docgen: {
        label: "vue-docgen-api",
        translate: (file) => translateAPIDocgen(file),
    },
    meta: {
        label: "vue-component-meta (this branch)",
        translate: (file) => translateAPI(file, tsconfig ? { tsconfig } : {}),
    },
    refactor: {
        label: "refactor/vue-component-meta",
        /* same tsconfig resolution as this branch for a fair comparison, the
         * earlier branch takes a single tsconfig as argument */
        translate: (file) =>
            translateAPIRefactor(file, resolveTsconfig(file, { tsconfig })),
    },
};
const baselineImplementation = implementations[baseline];
const candidateImplementation = implementations[candidate];

const includedFiles = new Set();
for (const pattern of include) {
    for await (const file of fs.glob(pattern, { cwd: root, exclude })) {
        includedFiles.add(path.resolve(root, file));
    }
}
const files = [...includedFiles].sort();

let newTotalMs = 0;
let oldTotalMs = 0;
const results = [];
for (const file of files) {
    const relative = path.relative(root, file).replaceAll("\\", "/");
    let oldApi;
    let newApi;
    let error;
    try {
        const oldStart = performance.now();
        oldApi = await baselineImplementation.translate(file);
        oldTotalMs += performance.now() - oldStart;
    } catch (err) {
        error = `${baselineImplementation.label}: ${err.cause?.message ?? err.message}`;
    }
    try {
        const newStart = performance.now();
        newApi = await candidateImplementation.translate(file);
        newTotalMs += performance.now() - newStart;
    } catch (err) {
        error = `${error ?? ""} ${candidateImplementation.label}: ${err.cause?.stack ?? err.message}`;
    }
    const changes = oldApi && newApi ? diffComponent(oldApi, newApi) : [];
    results.push({ file: relative, error, changes, oldApi, newApi });
}

const allChanges = results.flatMap((result) =>
    result.changes.map((change) => ({ file: result.file, ...change })),
);
const summary = new Map();
for (const change of allChanges) {
    const key = `${change.section}: ${change.kind}`;
    summary.set(key, (summary.get(key) ?? 0) + 1);
}

const lines = [
    `# ${baselineImplementation.label} vs ${candidateImplementation.label}`,
    "",
    `- Components: ${files.length}`,
    `- Identical output: ${results.filter((it) => !it.error && it.changes.length === 0).length}`,
    `- Errors: ${results.filter((it) => it.error).length}`,
    `- ${baselineImplementation.label} time: ${oldTotalMs.toFixed(0)} ms (sequential)`,
    `- ${candidateImplementation.label} time: ${newTotalMs.toFixed(0)} ms (sequential)`,
    "",
    "## Summary",
    "",
    "| Change | Count |",
    "| --- | --- |",
    ...[...summary.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, count]) => `| ${key} | ${count} |`),
    "",
    "## Errors",
    "",
    ...results
        .filter((it) => it.error)
        .map((it) => `- \`${it.file}\`: ${formatValue(it.error)}`),
    "",
    "## Changes",
    "",
    `| File | Section | Name | Change | ${baselineImplementation.label} | ${candidateImplementation.label} |`,
    "| --- | --- | --- | --- | --- | --- |",
    ...allChanges.map(
        (change) =>
            `| ${path.basename(change.file)} | ${change.section} | ${change.name} | ${change.kind} | ${formatValue(change.old)} | ${formatValue(change.new)} |`,
    ),
    "",
];

await fs.writeFile(path.join(outDir, "report.md"), lines.join("\n"));
await fs.writeFile(
    path.join(outDir, "report.json"),
    JSON.stringify(results, null, 2),
);
console.log(lines.slice(0, 40).join("\n"));
console.log(`\nFull report: ${path.join(outDir, "report.md")}`);
console.log(`rss ${(process.memoryUsage().rss / 1048576).toFixed(0)}MB`);
