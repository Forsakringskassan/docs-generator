import {
    type ApiMethodSignature,
    type ApiPropertySignature,
    type ApiInterface,
    ApiItemKind,
} from "@microsoft/api-extractor-model";
import { formatCode } from "../../utils";
import { renderDocNode } from "./render-doc-node";

function isSupported(item: {
    kind: ApiItemKind;
}): item is ApiPropertySignature | ApiMethodSignature {
    return [
        ApiItemKind.PropertySignature,
        ApiItemKind.MethodSignature,
    ].includes(item.kind);
}

function renderCode(item: ApiInterface): string {
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
        formatCode(source, "docs/api-interface.ts"),
        "```",
    ].join("\n");
}

function renderProperties(item: ApiInterface): string {
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
export function renderInterface(): {
    default(this: void, item: ApiInterface): string;
    interface(this: void, item: ApiInterface): string;
    properties(this: void, item: ApiInterface): string;
} {
    return {
        default(item) {
            return renderCode(item);
        },
        interface(item) {
            return renderCode(item);
        },
        properties(item) {
            return renderProperties(item);
        },
    };
}
