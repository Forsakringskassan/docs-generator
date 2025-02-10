const { build } = require("esbuild");

module.exports = async function setup() {
    await build({
        entryPoints: ["src/workers/format-worker.ts"],
        bundle: true,
        format: "esm",
        outdir: "temp/workers",
        platform: "node",
        target: "node20",
        metafile: true,
        external: ["prettier", "synckit"],
        outExtension: {
            ".js": ".mjs",
        },
    });
};
