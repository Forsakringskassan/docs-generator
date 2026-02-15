import {
    type ApiInterface,
    type ApiItem,
    ApiItemKind,
    ApiModel,
} from "@microsoft/api-extractor-model";
import { glob } from "glob";
import { type Processor, type ProcessorOptions } from "../../processor";
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

            for (const filename of await getFilenames(patterns)) {
                const apiModel = new ApiModel();
                const apiPackage = apiModel.loadPackage(filename);
                walk(apiPackage, {
                    [ApiItemKind.Interface](item) {
                        symbols.interface.push(item);
                    },
                });
            }

            const interfaceRenderer = renderInterface();
            for (const item of symbols.interface) {
                const id = item.canonicalReference.toString();
                const name = `interface:${item.name}`;
                context.addDocument({
                    kind: "partial",
                    id,
                    name,
                    alias: [],
                    body(tags) {
                        const variant = getVariant("interface", tags);
                        return interfaceRenderer[variant](item);
                    },
                    format: "markdown",
                    fileInfo: {
                        fullPath: item.sourceLocation.fileUrl,
                    },
                });
            }

            context.log(...loadedMessage("interface", symbols.interface));
        },
    };
}
