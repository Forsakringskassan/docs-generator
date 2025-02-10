import { type Options, format as prettier, resolveConfig } from "prettier";
import { runAsWorker } from "synckit";

const configCache = new Map<string, Options | null>();

async function getConfig(filepath: string): Promise<Options | null> {
    const cached = configCache.get(filepath);
    if (typeof cached !== "undefined") {
        return cached;
    }
    const options = await resolveConfig(filepath);
    configCache.set(filepath, options);
    return options;
}

/**
 * @internal
 */
export async function formatCode(
    source: string,
    filepath: string,
): Promise<string> {
    const options = await getConfig(filepath);
    const formatted = await prettier(source, { ...options, filepath });
    return formatted.trim();
}

runAsWorker(formatCode);
