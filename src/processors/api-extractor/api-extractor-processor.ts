import {
    type ApiInterface,
    type ApiItem,
    ApiItemKind,
    ApiModel,
} from "@microsoft/api-extractor-model";
import { glob } from "glob";
import { type DocumentPartial } from "../../document";
import { type Processor, type ProcessorOptions } from "../../processor";
import { naturalJoin } from "../../utils";
import { getVariant } from "./get-variant";
import { renderInterface } from "./render-interface";

/**
 * Options for {@link apiExtractorProcessor}.
 *
 * @public
 */
export interface ApiExtractorProcessorOptions extends ProcessorOptions {
    apiModel?: string | string[];
}

function getFilenames(patterns: string | string[]): Promise<string[]> {
    return glob(patterns, { posix: true });
}

function pluralize(text: string, array: unknown[]): string {
    const s = array.length !== 1 ? "s" : "";
    return `${text}${s}`;
}

function loadedMessage(kind: string, array: unknown[]): unknown[] {
    return [array.length, pluralize(kind, array), "loaded"];
}

function getInheritOption(tags: string[]): boolean | undefined {
    if (tags.includes("inherit")) {
        return true;
    }

    if (tags.includes("noinherit")) {
        return false;
    }

    return undefined;
}

interface WalkFnTable {
    [ApiItemKind.Interface]: (item: ApiInterface) => void;
}

function walk(root: ApiItem, fns: Partial<WalkFnTable>): void {
    const t = fns as Partial<Record<ApiItemKind, (item: ApiItem) => void>>;
    for (const member of root.members) {
        const fn = t[member.kind];
        if (fn) {
            fn(member);
        }
        walk(member, fns);
    }
}

/**
 * Return list of ambiguous ids if the name is ambiguous.
 */
function isAmbigious(
    name: string,
    names: Map<string, string[]>,
): string[] | null {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- 1 or more must have been found */
    const found = names.get(name)!;
    return found.length > 1 ? found : null;
}

/**
 * @param id - Canonical unique identifier
 * @param name - Short user-defined name (might be ambiguous).
 */
function createPartial(options: {
    id: string;
    name: string;
    names: Map<string, string[]>;
    fullPath: string | undefined;
    render(this: void, tags: string[]): string;
}): DocumentPartial {
    const { id, name, fullPath, names, render } = options;
    return {
        kind: "partial",
        id,
        alias: [],
        name: `interface:${name}`,
        body(tags, reference) {
            /* if this partial was found by name, test if the name was ambiguous */
            if (reference.kind === "name") {
                const ambigious = isAmbigious(name, names);
                if (ambigious) {
                    const quoted = ambigious.map((it) => `"${it}"`);
                    const ids = naturalJoin(quoted, "and");
                    throw new Error(
                        `Ambiguous name "${name}", found ${ambigious.length} interfaces matching this name: ${ids}`,
                    );
                }
            }

            return render(tags);
        },
        format: "markdown",
        fileInfo: {
            fullPath,
        },
    };
}

/**
 * Reads one or more API Extractor models and generates partial documents which
 * can be included into markdown documents.
 *
 * @public
 */
export function apiExtractorProcessor(
    options: ApiExtractorProcessorOptions = {},
): Processor {
    const { apiModel: patterns = [], enabled = true } = options;
    return {
        name: "apiExtractorProcessor",
        after: "generate-docs",
        async handler(context) {
            if (!enabled) {
                return;
            }

            const symbols = {
                interface: [] as ApiInterface[],
            };

            const filenames = await getFilenames(patterns);
            for (const filename of filenames) {
                const apiModel = new ApiModel();
                const apiPackage = apiModel.loadPackage(filename);
                walk(apiPackage, {
                    [ApiItemKind.Interface](item) {
                        symbols.interface.push(item);
                    },
                });
            }

            const interfaceRenderer = renderInterface();
            const seenInterfaces = new Map<string, string[]>();
            for (const item of symbols.interface) {
                /* unique id */
                const id = item.canonicalReference.toString();

                /* store mapping between short names and unique id to find duplicated names */
                const found = seenInterfaces.get(item.name) ?? [];
                seenInterfaces.set(item.name, [...found, id]);

                const partial = createPartial({
                    id,
                    name: item.name,
                    names: seenInterfaces,
                    fullPath: item.sourceLocation.fileUrl,
                    render(tags) {
                        const variant = getVariant("interface", tags);
                        return interfaceRenderer[variant](item, {
                            inherit: getInheritOption(tags),
                        });
                    },
                });

                context.addDocument(partial);
            }

            context.log(...loadedMessage("interface", symbols.interface));
        },
    };
}
