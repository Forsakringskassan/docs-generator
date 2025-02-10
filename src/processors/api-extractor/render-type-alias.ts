import { type ApiTypeAlias } from "@microsoft/api-extractor-model";
import { formatCode } from "../../utils";

/**
 * @internal
 */
export async function renderTypeAlias(item: ApiTypeAlias): Promise<string> {
    const source = `${item.excerpt.text}`;
    return [
        "```ts nocompile nolint",
        formatCode(source, "docs/api-type.ts"),
        "```",
    ].join("\n");
}
