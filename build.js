const fs = require("node:fs");
const path = require("node:path");
const { URL, fileURLToPath } = require("node:url");
const esbuild = require("esbuild");
const isCI = require("is-ci");
const sass = require("sass");
const { Extractor, ExtractorConfig } = require("@microsoft/api-extractor");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const { externalDependencies, peerDependencies } = pkg;

/** @type {import("sass").Importer<"async">} */
const sassCSSVariableImporter = {
    canonicalize(url, context) {
        const canonicalUrl = new URL(`${url}.mjs`, context.containingUrl);
        const filePath = fileURLToPath(canonicalUrl);
        if (fs.existsSync(filePath)) {
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
            importers: [sassCSSVariableImporter],
        });
        fs.mkdirSync(path.dirname(dst), { recursive: true });
        fs.writeFileSync(dst, result.css, "utf-8");
    }
}

async function build() {
    const result1 = await esbuild.build({
        entryPoints: ["src/generator.ts"],
        bundle: true,
        metafile: true,
        format: "cjs",
        platform: "node",
        target: ["node16"],
        outdir: "dist",
        logLevel: "info",
        external: [
            "@babel/core",
            "vue",
            "vue-template-compiler",
            "@vue/compiler-core",
            "@vue/compiler-sfc",
            "@vue/component-compiler",
            "@vue/component-compiler-utils",
            "typescript",
            ...externalDependencies,
            ...Object.keys(peerDependencies),
        ],
    });
    console.log(await esbuild.analyzeMetafile(result1.metafile));

    const result2 = await esbuild.build({
        entryPoints: ["src/compile-example.ts"],
        bundle: true,
        metafile: true,
        format: "cjs",
        platform: "node",
        target: ["node16"],
        outdir: "dist",
        logLevel: "info",
        external: [
            "vue",
            "vue-template-compiler",
            "@vue/compiler-core",
            "@vue/compiler-sfc",
            "@vue/component-compiler",
            "@vue/component-compiler-utils",
            "typescript",
            ...externalDependencies,
            ...Object.keys(peerDependencies),
        ],
    });
    console.log(await esbuild.analyzeMetafile(result2.metafile));

    const markdownBundle = await esbuild.build({
        entryPoints: [{ in: "src/markdown.ts", out: "markdown" }],
        bundle: true,
        metafile: true,
        format: "cjs",
        platform: "node",
        target: "node16",
        logLevel: "info",
        outdir: "dist",
    });
    console.log(await esbuild.analyzeMetafile(markdownBundle.metafile));

    const result3 = await esbuild.build({
        entryPoints: [{ in: "src/runtime/index.ts", out: "runtime" }],
        bundle: true,
        metafile: true,
        format: "cjs",
        platform: "browser",
        logLevel: "info",
        outdir: "dist",
    });
    console.log(await esbuild.analyzeMetafile(result3.metafile));

    if (isCI) {
        console.group(`Running API Extractor in CI mode.`);
    } else {
        console.group(`Running API Extractor in local mode.`);
    }
    for (const entrypoint of ["generator", "markdown", "runtime"]) {
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
