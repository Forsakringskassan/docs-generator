import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path/posix";
import { URL, fileURLToPath } from "node:url";
import esbuild from "esbuild";
import isCI from "is-ci";
import { rollup, defineConfig } from "rollup";
import esbuildPlugin from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import { visualizer } from "rollup-plugin-visualizer";
import { workerPlugin } from "@sidvind/rollup-plugin-worker";
import * as sass from "sass";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";

const pkg = JSON.parse(await fs.readFile("package.json", "utf-8"));
const { externalDependencies, peerDependencies } = pkg;

const rootDir = fileURLToPath(new URL(".", import.meta.url));

/** @type {import("sass").Importer<"async">} */
const sassCSSVariableImporter = {
    canonicalize(url, context) {
        const canonicalUrl = new URL(`${url}.mjs`, context.containingUrl);
        const filePath = fileURLToPath(canonicalUrl);
        if (existsSync(filePath)) {
            return canonicalUrl;
        } else {
            return null;
        }
    },
    async load(canonicalUrl) {
        const { default: module } = await import(canonicalUrl);
        const variables = Object.entries(module).flatMap(([key, entry]) => {
            const prefix = key === "*" ? "--docs-" : `--docs-${key}-`;
            return Object.entries(entry.variables).map(([variable, it]) => {
                return {
                    variable: `${prefix}${variable}`,
                    value: it.value,
                };
            });
        });
        const lines = variables.map((it) => `${it.variable}: ${it.value};`);
        return {
            contents: `:root { ${lines.join(" ")} }`,
            syntax: "css",
        };
    },
};

/**
 * @param {Array<{ src: string, dst: string }>} entrypoints
 */
async function buildStyle(entrypoints) {
    console.log();
    for (const { src, dst } of entrypoints) {
        console.log("Building", src, "->", dst);
        const result = await sass.compileAsync(src, {
            style: "expanded",
            loadPaths: ["./node_modules"],
            importers: [sassCSSVariableImporter],
        });
        await fs.mkdir(path.dirname(dst), { recursive: true });
        await fs.writeFile(dst, result.css, "utf-8");
    }
}

async function getProcessorScripts() {
    const { availableProcessors, processorRuntimeName } = await import(
        "./dist/index.mjs"
    );
    return availableProcessors
        .filter((processor) => {
            return processor.runtime && processor.runtime.length > 0;
        })
        .map((processor) => {
            return processor.runtime.map((entry) => ({
                in: entry.src,
                out: processorRuntimeName(processor, entry),
            }));
        })
        .flat();
}

async function build() {
    await fs.rm("dist", { recursive: true, force: true });

    const options = defineConfig({
        input: ["src/index.ts", "src/markdown.ts"],
        external: [
            "@babel/core",
            "express",
            "vue",
            "vue/compiler-sfc",
            "vue-template-compiler",
            "@vue/compiler-core",
            "@vue/compiler-sfc",
            "@vue/component-compiler",
            "@vue/component-compiler-utils",
            "typescript",
            ...externalDependencies,
            ...Object.keys(peerDependencies),
        ],
        plugins: [
            commonjs(),
            nodeResolve({
                preferBuiltins: true,
            }),
            json(),
            workerPlugin(),
            esbuildPlugin({
                platform: "node",
                format: "esm",
                target: ["node20"],
            }),
            visualizer({
                filename: "temp/bundle.html",
            }),
        ],
    });
    const bundle = await rollup(options);
    const { output } = await bundle.write({
        dir: "dist",
        format: "esm",
        sourcemap: true,
        entryFileNames: "[name].mjs",
        chunkFileNames: "[name]-[hash].mjs",
        banner: [
            `import { createRequire as $createRequire } from "node:module";`,
            ``,
            `const require = $createRequire(import.meta.url);`,
            ``,
        ].join("\n"),
        manualChunks(id) {
            const fullPath = id.replace(/[?].*/, "").replace("\x00", "");
            const base = path.relative(rootDir, fullPath).replace(/\\/g, "/");
            if (base.startsWith("node_modules/")) {
                return "vendor";
            }
            if (base.startsWith("internal/plugin-vue2")) {
                return "vue2";
            }
            if (base.startsWith("internal/plugin-vue3")) {
                return "vue3";
            }
            return undefined;
        },
    });
    for (const item of output) {
        if (item.type === "chunk") {
            console.log(path.join("dist", item.fileName), "written");
        }
    }
    await bundle.close();

    const processorScripts = await getProcessorScripts();
    const result = await esbuild.build({
        entryPoints: [
            { in: "src/runtime/bootstrap.ts", out: "runtime-bootstrap" },
            { in: "src/runtime/index.ts", out: "runtime" },
            ...processorScripts,
        ],
        bundle: true,
        metafile: true,
        format: "esm",
        platform: "browser",
        outExtension: {
            ".js": ".mjs",
        },
        logLevel: "info",
        outdir: "dist",
    });
    console.log(await esbuild.analyzeMetafile(result.metafile));

    if (isCI) {
        console.group(`Running API Extractor in CI mode.`);
    } else {
        console.group(`Running API Extractor in local mode.`);
    }
    for (const entrypoint of ["index", "markdown", "runtime"]) {
        const filename = `api-extractor-${entrypoint}.json`;
        const config = ExtractorConfig.loadFileAndPrepare(filename);
        const result = Extractor.invoke(config, {
            localBuild: !isCI,
            showVerboseMessages: true,
        });
        if (result.succeeded) {
            console.log(`API Extractor completed successfully`);
        } else {
            const { errorCount, warningCount } = result;
            console.error(
                [
                    "API Extractor completed with",
                    `${errorCount} error(s) and ${warningCount} warning(s)`,
                ].join("\n"),
            );
            process.exitCode = 1;
        }
    }
    console.groupEnd();

    await buildStyle([
        { src: "src/style/core.scss", dst: "dist/style/core.css" },
        { src: "src/style/site.scss", dst: "dist/style/site.css" },
        { src: "src/style/style.scss", dst: "dist/style/index.css" },
    ]);
}

build().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
