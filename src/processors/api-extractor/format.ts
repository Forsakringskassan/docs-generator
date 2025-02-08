import { type Options, format as prettier, resolveConfig } from "prettier";

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
export async function format(
    source: string,
    kind: "interface" | "function" | "type",
): Promise<string> {
    const filepath = `docs/api-${kind}.ts`;
    const options = await getConfig(filepath);
    const formatted = await prettier(source, { ...options, filepath });
    return formatted.trim();
}
