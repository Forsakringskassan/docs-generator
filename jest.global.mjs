import { build } from "esbuild";

export default async function setup() {
    await build({
        entryPoints: ["src/utils/format-code.worker.ts"],
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
}
