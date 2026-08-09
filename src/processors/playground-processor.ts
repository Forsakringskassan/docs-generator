import fs from "node:fs/promises";
import path from "node:path";
import { strFromU8, strToU8, zlibSync } from "fflate";
import { type Processor, type ProcessorOptions } from "../processor";
import { interpolate } from "../utils";

/**
 * Options for a playground entry.
 *
 * @public
 */
export interface PlaygroundProcessorEntry {
    /**
     * Unique identifier for this playground.
     */
    readonly id: string;

    /**
     * Name of template variable with the playground URL to inject.
     *
     * If unspecified, no template variable will be available.
     */
    readonly variable?: string;

    /**
     * The URL format.
     *
     * The following placeholders are available:
     *
     * - `base64`: Base64 encoded payload (use "atou" to decode unicode codepoints).
     * - `zlibBase64`: zlib base64 encoded payload.
     */
    readonly urlFormat: string;

    /**
     * Path to a folder with files to inject into the playground url.
     *
     * If unspecified, no files will be injected by default.
     */
    readonly folder?: string;

    /**
     * Serialize the files to a string for using in the url generation.
     *
     * Default is `JSON.stringify()`.
     */
    serialize?(
        this: void,
        context: {
            readonly files: Map<string, string>;
        },
    ): string | Promise<string>;
}

/**
 * Options for {@link playgroundProcessor}.
 *
 * @public
 */
export interface PlaygroundProcessorOptions extends ProcessorOptions {
    /**
     * List of playgrounds available.
     *
     * Default is empty array (no playgrounds enabled)
     */
    readonly entries?: PlaygroundProcessorEntry[];
}

/**
 * @internal
 */
export interface NormalizedEntry {
    readonly id: string;
    readonly variable: string | null;
    readonly urlFormat: string;
    readonly folder: string | null;
    serialize(
        this: void,
        context: {
            readonly files: Map<string, string>;
        },
    ): string | Promise<string>;
}

function utoa(value: string): string {
    /* eslint-disable-next-line @typescript-eslint/no-deprecated -- deprecated by the standard way of handling unicode codepoints */
    return btoa(unescape(encodeURIComponent(value)));
}

const encoder: Partial<Record<PropertyKey, (value: string) => string>> = {
    base64(value) {
        return utoa(value);
    },
    zlibBase64(value) {
        const buffer = strToU8(value);
        const zipped = zlibSync(buffer, { level: 9 });
        const binary = strFromU8(zipped, true);
        return btoa(binary);
    },
};

function defaultSerializer(
    this: void,
    context: { readonly files: Map<string, string> },
): string {
    const { files } = context;
    return JSON.stringify(Object.fromEntries(files));
}

/**
 * @internal
 */
export function normalizeEntry(
    entry: PlaygroundProcessorEntry,
): NormalizedEntry {
    return {
        variable: null,
        folder: null,
        ...entry,
        serialize: entry.serialize ?? defaultSerializer,
    };
}

/**
 * @internal
 */
export function normalizeEntries(
    entries: PlaygroundProcessorEntry[] | undefined,
): NormalizedEntry[] {
    if (!entries) {
        return [];
    }
    return entries.map(normalizeEntry);
}

/**
 * @internal
 */
export async function getFiles(
    entry: Pick<NormalizedEntry, "folder">,
): Promise<Map<string, string>> {
    const { folder: cwd } = entry;
    const result = new Map<string, string>();
    if (!cwd) {
        return result;
    }
    const filenames = await Array.fromAsync(fs.glob("**", { cwd }));
    const sorted = filenames.toSorted((a, b) => a.localeCompare(b));
    for (const filename of sorted) {
        const filePath = path.join(cwd, filename);
        const st = await fs.lstat(filePath);
        if (!st.isFile()) {
            continue;
        }
        const content = await fs.readFile(filePath, "utf8");
        result.set(filename, content);
    }
    return result;
}

function encode(key: PropertyKey, value: string): string | undefined {
    const fn = encoder[key] ?? (() => undefined);
    return fn(value);
}

/**
 * @internal
 */
export async function generateUrl(
    entry: Pick<NormalizedEntry, "folder" | "serialize" | "urlFormat">,
): Promise<string> {
    const files = await getFiles(entry);
    const payload = await entry.serialize({ files });
    const lazyEvaluation = new Proxy({}, { get: (_, k) => encode(k, payload) });
    return encodeURI(interpolate(entry.urlFormat, lazyEvaluation));
}

/**
 * Generates links to code playgrounds.
 *
 * @public
 */
/* istanbul ignore next */
export function playgroundProcessor(
    options: PlaygroundProcessorOptions,
): Processor {
    const { enabled = true } = options;
    const entries = normalizeEntries(options.entries);
    return {
        after: "generate-docs",
        name: "playground-processor",
        async handler(context) {
            if (!enabled) {
                return;
            }
            for (const entry of entries) {
                if (!entry.variable) {
                    continue;
                }
                const url = await generateUrl(entry);
                context.setTemplateData(entry.variable, url);
            }
        },
    };
}
