import { type ApiTypeAlias } from "@microsoft/api-extractor-model";
import { format } from "./format";

/**
 * @internal
 */
export async function renderTypeAlias(item: ApiTypeAlias): Promise<string> {
    const source = `${item.excerpt.text}`;
    return ["```ts nocompile nolint", await format(source, "type"), "```"].join(
        "\n",
    );
}
