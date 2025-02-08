import {
    type ApiMethodSignature,
    type ApiPropertySignature,
    type ApiInterface,
    ApiItemKind,
} from "@microsoft/api-extractor-model";
import { format } from "./format";
import { renderDocNode } from "./render-doc-node";

function isSupported(item: {
    kind: ApiItemKind;
}): item is ApiPropertySignature | ApiMethodSignature {
    return [
        ApiItemKind.PropertySignature,
        ApiItemKind.MethodSignature,
    ].includes(item.kind);
}

async function renderCode(item: ApiInterface): Promise<string> {
    const members = item.members.map((it) => {
        if (!isSupported(it)) {
            throw new Error(
                `Internal error: unhandled kind "${it.kind}" when rendering interface`,
            );
        }
        return it.excerpt.text;
    });
    const source = `${item.excerpt.text.replace(/^export /, "")} { ${members.join("")} }`;
    return [
        "```ts nocompile nolint",
        await format(source, "interface"),
        "```",
    ].join("\n");
}

async function renderTable(item: ApiInterface): Promise<string> {
    return item.members
        .map((it) => {
            if (!isSupported(it)) {
                throw new Error(
                    `Internal error: unhandled kind "${it.kind}" when rendering interface`,
                );
            }
            const optional = it.isOptional ? " {@optional}" : "";
            const summary = it.tsdocComment
                ? renderDocNode(it.tsdocComment.summarySection)
                      .trim()
                      .split("\n")
                      .map((it, i) => {
                          const prefix = i === 0 ? ": " : "    ";
                          return `${prefix}${it}\n`;
                      })
                : ": &dash;\n";
            return [`\`${it.excerpt.text}\`${optional}\n`, ...summary].join("");
        })
        .join("\n");
}

/**
 * @internal
 */
export async function renderInterface(
    item: ApiInterface,
): Promise<{ default: string; code: string; table: string }> {
    const code = await renderCode(item);
    const table = await renderTable(item);
    return {
        code,
        table,
        default: code,
    };
}
