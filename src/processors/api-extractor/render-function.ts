import { type ApiFunction } from "@microsoft/api-extractor-model";
import { format } from "./format";
import { renderDocNode } from "./render-doc-node";

async function renderCode(item: ApiFunction): Promise<string> {
    const source = item.excerpt.text.replace(/^export declare /, "");
    return [
        "```ts nocompile nolint",
        await format(source, "function"),
        "```",
    ].join("\n");
}

async function renderTable(item: ApiFunction): Promise<string> {
    return item.parameters
        .map((it) => {
            const optional = it.isOptional ? " {@optional}" : "";
            const summary = it.tsdocParamBlock
                ? renderDocNode(it.tsdocParamBlock.content)
                      .trim()
                      .split("\n")
                      .map((it, i) => {
                          const prefix = i === 0 ? ": " : "    ";
                          return `${prefix}${it}\n`;
                      })
                : ": &dash;\n";
            return [
                `\`${it.name}: ${it.parameterTypeExcerpt.text}\`${optional}\n`,
                ...summary,
            ].join("");
        })
        .join("\n");
}

/**
 * @internal
 */
export async function renderFunction(
    item: ApiFunction,
): Promise<{ default: string; code: string; table: string }> {
    const code = await renderCode(item);
    const table = await renderTable(item);
    return {
        code,
        table,
        default: code,
    };
}
