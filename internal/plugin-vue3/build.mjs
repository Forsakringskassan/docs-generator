import fs from "node:fs";
import esbuild from "esbuild";

const pkg = JSON.parse(fs.readFileSync("../../package.json", "utf-8"));
const { externalDependencies, peerDependencies } = pkg;

try {
    const result = await esbuild.build({
        entryPoints: ["src/index.ts"],
        bundle: true,
        metafile: true,
        sourcemap: true,
        format: "esm",
        platform: "node",
        target: ["node20"],
        outdir: "dist",
        logLevel: "info",
        external: [
            "@vue/compiler-core",
            "@vue/compiler-sfc",
            "cheerio",
            "he",
            "pug",
            "source-map",
            "typescript",
            "uglify-js",
            "vue",
            ...externalDependencies,
            ...Object.keys(peerDependencies),
        ],
    });
    const report = await esbuild.analyzeMetafile(result.metafile);
    console.log(report);
} catch (err) {
    console.error(err);
    process.exitCode = 1;
}
