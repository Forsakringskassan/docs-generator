import { parentPort } from "node:worker_threads";
import { version } from "vue";
import { type Plugin, build as esbuild } from "esbuild";
import { virtualEntryPlugin } from "../esbuild";
import { tsconfigPath as tsconfig } from "../tsconfig-path";
import { type ExampleCompileTask } from "./example-task";
import {
    type ExtractedDependencies,
    extractDependencies,
} from "./extract-dependencies";
import { vuePlugin as Vue3Plugin } from "plugin-vue3";

/**
 * @internal
 */
export interface CompileMessage<T = unknown> {
    readonly message: "compile";

    /** a reference that will be passed back to the callee */
    readonly ref: T;

    /** directory where output files will be written */
    readonly outputFolder: string;

    /** external libraries */
    readonly external: string[];

    /** jobs to compile in this batch */
    readonly tasks: ExampleCompileTask[];
}

/**
 * @internal
 */
export interface CompileResponse<T = unknown> {
    /** reference given in the `CompileTask` */
    readonly ref: T;

    /** collected results from each task */
    readonly results: CompileResult[];
}

/**
 * @internal
 */
export interface CompileResult extends ExampleCompileTask {
    /** files the compiled example depends on */
    readonly dependencies: ExtractedDependencies;
}

/**
 * @internal
 */
interface CompileOptions {
    readonly outputFolder: string;
    readonly external: string[];
}

const vueMajor = Number(version.split(".", 2)[0]) as 2 | 3;

function stripExtension(filename: string): string {
    return filename.replace(".js", "");
}

function VuePlugin(): Plugin {
    switch (vueMajor) {
        case 2:
            throw new Error(
                "Vue 2 is no longer supported, upgrade to Vue 3 or downgrade docs-generator",
            );
        case 3:
            return Vue3Plugin();
    }
}

function virtualEntryPoint(task: ExampleCompileTask): string {
    return `virtual:${task.sourceFile}:${task.outputFile}`;
}

async function compileExample(
    options: CompileOptions,
    task: ExampleCompileTask,
): Promise<CompileResult> {
    const { outputFolder: outdir, external } = options;
    const entryPoints = [
        { in: virtualEntryPoint(task), out: stripExtension(task.outputFile) },
    ];
    const virtualEntries = { [virtualEntryPoint(task)]: task.sourcecode };
    const iconLib = process.env.DOCS_ICON_LIB ?? "@fkui/icon-lib-default";
    const { metafile } = await esbuild({
        entryPoints,
        outdir,
        metafile: true,
        bundle: true,
        format: "esm",
        platform: "browser",
        external,
        tsconfig,
        define: {
            "process.env.NODE_ENV": JSON.stringify("development"),
            "process.env.DOCS_ICON_LIB": JSON.stringify(iconLib),
        },
        plugins: [virtualEntryPlugin(virtualEntries), VuePlugin()],
    });
    return {
        ...task,
        dependencies: extractDependencies(metafile, process.cwd()),
    };
}

async function compileExampleMultiple(
    options: CompileOptions,
    tasks: ExampleCompileTask[],
): Promise<CompileResult[]> {
    return Promise.all(tasks.map((task) => compileExample(options, task)));
}

const queue: Array<() => Promise<void>> = [];

const port = parentPort;
if (port) {
    let runner = true;
    port.on("message", async (message: CompileMessage) => {
        const { tasks } = message;

        /* push task on queue but don't execute it yet */
        queue.push(async () => {
            const results = await compileExampleMultiple(message, tasks);
            const response: CompileResponse = {
                ref: message.ref,
                results,
            };
            port.postMessage(response);
        });

        /* only first occurrence will pick up and actually run tasks */
        if (!runner) {
            return;
        }

        runner = false;
        try {
            while (queue.length > 0) {
                const next = queue.pop();
                if (next) {
                    await next();
                }
            }
        } finally {
            /* reset flag in case main thread is slow to push tasks, we want the
             * next occurrence to start picking up tasks again */
            runner = true;
        }
    });
}
