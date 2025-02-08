import { glob } from "glob";
import {
    ApiFunction,
    ApiInterface,
    ApiItem,
    ApiItemKind,
    ApiModel,
    ApiTypeAlias,
} from "@microsoft/api-extractor-model";
import { type Processor, type ProcessorOptions } from "../../processor";
import { renderInterface } from "./render-interface";
import { renderTypeAlias } from "./render-type-alias";
import { getVariant } from "./get-variant";
import { renderFunction } from "./render-function";

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
    [ApiItemKind.Function]: (item: ApiFunction) => void;
    [ApiItemKind.TypeAlias]: (item: ApiTypeAlias) => void;
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
                function: [] as ApiFunction[],
                typeAlias: [] as ApiTypeAlias[],
            };

            for (const filename of await getFilenames(patterns)) {
                const apiModel = new ApiModel();
                const apiPackage = apiModel.loadPackage(filename);
                walk(apiPackage, {
                    [ApiItemKind.TypeAlias](item) {
                        symbols.typeAlias.push(item);
                    },
                    [ApiItemKind.Function](item) {
                        symbols.function.push(item);
                    },
                    [ApiItemKind.Interface](item) {
                        symbols.interface.push(item);
                    },
                });
            }

            for (const item of symbols.interface) {
                const variants = await renderInterface(item);
                context.addDocument({
                    kind: "partial",
                    id: item.canonicalReference.toString(),
                    name: `interface:${item.name}`,
                    alias: [],
                    body(tags) {
                        const variant = getVariant(tags);
                        return variants[variant];
                    },
                    format: "markdown",
                    fileInfo: {
                        fullPath: item.sourceLocation.fileUrl,
                    },
                });
            }

            for (const item of symbols.function) {
                const variants = await renderFunction(item);
                context.addDocument({
                    kind: "partial",
                    id: item.canonicalReference.toString(),
                    name: `function:${item.name}`,
                    alias: [],
                    body(tags) {
                        const variant = getVariant(tags);
                        return variants[variant];
                    },
                    format: "markdown",
                    fileInfo: {
                        fullPath: item.sourceLocation.fileUrl,
                    },
                });
            }

            for (const item of symbols.typeAlias) {
                const body = await renderTypeAlias(item);
                context.addDocument({
                    kind: "partial",
                    id: item.canonicalReference.toString(),
                    name: `type:${item.name}`,
                    alias: [],
                    body,
                    format: "markdown",
                    fileInfo: {
                        fullPath: item.sourceLocation.fileUrl,
                    },
                });
            }

            context.log(...loadedMessage("interface", symbols.interface));
            context.log(...loadedMessage("function", symbols.function));
            context.log(...loadedMessage("type", symbols.typeAlias));
        },
    };
}
