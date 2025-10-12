import { type Processor, type ProcessorRuntime } from "./processor";

/**
 * Derive default runtime script name from processor.
 *
 * @internal
 */
export function processorRuntimeName(
    processor: Processor,
    runtime: ProcessorRuntime,
): string {
    const { name } = processor;
    const base = name.replace(/-processor/, "");
    return `processors/${runtime.name ?? base}`;
}
