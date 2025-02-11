import { type ApiFunction } from "@microsoft/api-extractor-model";
import { formatCode } from "../../utils";
import { renderDocNode } from "./render-doc-node";

/**
 * @internal
 */
export function renderPrototype(item: ApiFunction): string {
    const source = item.excerpt.text.replace(/^export declare /, "");
    return [
        "```ts nocompile nolint",
        formatCode(source, "docs/api-function.ts"),
        "```",
    ].join("\n");
}

/**
 * @internal
 */
export function renderParameters(item: ApiFunction): string {
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
export function renderReturnvalue(item: ApiFunction): string {
    return renderDocNode(item.tsdocComment?.returnsBlock?.content).trim();
}

/**
 * @internal
 */
/* istanbul ignore next: wrapper doesn't need unittesting */
export function renderFunction(): {
    default(this: void, item: ApiFunction): string;
    prototype(this: void, item: ApiFunction): string;
    parameters(this: void, item: ApiFunction): string;
    returnvalue(this: void, item: ApiFunction): string;
    docs(this: void, item: ApiFunction): string;
} {
    return {
        default(item) {
            return renderPrototype(item);
        },
        prototype(item) {
            return renderPrototype(item);
        },
        parameters(item) {
            return renderParameters(item);
        },
        returnvalue(item) {
            return renderReturnvalue(item);
        },
        docs(item) {
            return [
                "# Syntax",
                "",
                renderPrototype(item),
                "",
                "## Parameters",
                renderParameters(item),
                "",
                "## Return value",
                "",
                renderReturnvalue(item),
            ].join("\n");
        },
    };
}
