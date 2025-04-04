import path from "node:path";
import { type Plugin, build as esbuild } from "esbuild";
import { version } from "vue";
import { vuePlugin as Vue3Plugin } from "plugin-vue3";
import { virtualEntryPlugin } from "./esbuild";
import { type ExampleCompileTask, type ExampleBatch } from "./examples";

const vueMajor = parseInt(version.split(".", 2)[0], 10) as 2 | 3;
const tsconfig = path.join(__dirname, "../tsconfig-examples.json");

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

async function compileExample(batch: ExampleBatch): Promise<void> {
    const { outputFolder: outdir, external, tasks } = batch;
    const entryPoints = tasks.map((it) => {
        return {
            in: virtualEntryPoint(it),
            out: stripExtension(it.outputFile),
        };
    });
    const virtualEntries = tasks.map((it): [key: string, value: string] => {
        return [virtualEntryPoint(it), it.sourcecode];
    });
    const iconLib = process.env.DOCS_ICON_LIB ?? "@fkui/icon-lib-default";
    try {
        await esbuild({
            entryPoints,
            outdir,
            bundle: true,
            format: "esm",
            platform: "browser",
            external,
            tsconfig,
            define: {
                "process.env.NODE_ENV": JSON.stringify("development"),
                "process.env.DOCS_ICON_LIB": JSON.stringify(iconLib),
            },
            plugins: [
                virtualEntryPlugin(Object.fromEntries(virtualEntries)),
                VuePlugin(),
            ],
        });
    } catch (err) {
        /* eslint-disable-next-line no-console -- expected to log */
        console.error(err);
        process.exitCode = 1;
    }
}

async function readBatchData(): Promise<ExampleBatch> {
    const { stdin } = process;
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stdin.on("data", (chunk) => {
            chunks.push(chunk);
        });
        stdin.on("end", () => {
            const content = Buffer.concat(chunks).toString("utf-8");
            const parsed = JSON.parse(content);
            resolve(parsed);
        });
        stdin.on("error", (error) => {
            reject(error);
        });
    });
}

async function run(): Promise<void> {
    const batch = await readBatchData();
    await compileExample(batch);
}

run();
