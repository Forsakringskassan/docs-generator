import {
    type ApiInterface,
    type ApiMethodSignature,
    type ApiPropertySignature,
    ApiItemKind,
} from "@microsoft/api-extractor-model";
import { formatCode } from "../../utils";
import { documentation, documentationComment } from "./documentation";

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
        /* istanbul ignore next: should not happen, if it does it will explode
         * on purpose to catch the error */
        if (!isSupported(it)) {
            throw new Error(
                `Internal error: unhandled kind "${it.kind}" when rendering interface`,
            );
        }
        const summary = documentationComment(it);
        const comment = summary ? `\n${summary}` : "";
        return `${comment}\n${it.excerpt.text}`;
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
            /* istanbul ignore next: should not happen, if it does it will
             * explode on purpose to catch the error */
            if (!isSupported(it)) {
                throw new Error(
                    `Internal error: unhandled kind "${it.kind}" when rendering interface`,
                );
            }
            const optional = it.isOptional ? " {@optional}" : "";
            const summary = documentation(it);
            const lines = summary
                ? summary.split("\n").map((it, i) => {
                      if (it.trim() === "") {
                          return "\n";
                      }
                      const prefix = i === 0 ? ": " : "    ";
                      return `${prefix}${it.trim()}\n`;
                  })
                : [": &dash;\n"];
            return [`\`${it.excerpt.text}\`${optional}\n`, ...lines].join("");
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
