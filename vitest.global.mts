import { build } from "esbuild";

export async function setup(): Promise<void> {
    await build({
        entryPoints: ["src/utils/format-code.worker.ts"],
        bundle: true,
        format: "esm",
        outdir: "temp/workers",
        platform: "node",
        target: "node22",
        metafile: true,
        external: ["prettier", "synckit"],
        outExtension: {
            ".js": ".mjs",
        },
    });
}
