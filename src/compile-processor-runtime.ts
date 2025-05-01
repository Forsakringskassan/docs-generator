import { existsSync } from "node:fs";
import path from "node:path";
import { type Generator } from "./generator";
import { type Processor } from "./processor";
import { processorRuntimeName } from "./processor-runtime-name";

/**
 * Queues all runtime scripts from enabled processors to be compiled.
 *
 * @internal
 */
export function compileProcessorRuntime(
    generator: Pick<Generator, "compileScript">,
    distDir: string,
    processors: Processor[],
): void {
    for (const processor of processors) {
        if (processor.enabled === false) {
            continue;
        }
        const { runtime } = processor;
        for (const entry of runtime ?? []) {
            const assetName = [
                "processors",
                processor.name.replace(/-processor/, ""),
                entry.name ?? path.parse(entry.src).name,
            ].join("/");
            const name = processorRuntimeName(processor, entry);
            const bundled = new URL(`${name}.mjs`, distDir);
            const scriptPath = existsSync(bundled) ? bundled : entry.src;
            generator.compileScript(
                assetName,
                scriptPath,
                {
                    appendTo: "body",
                    priority: 50,
                },
                {
                    ...entry.buildOptions,
                },
            );
        }
    }
}
