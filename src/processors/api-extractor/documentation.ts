import {
    type ApiDocumentedItem,
    type ApiItem,
} from "@microsoft/api-extractor-model";
import { type DocNode, DocExcerpt } from "@microsoft/tsdoc";

function isDocumentedItem(item: ApiItem): item is ApiDocumentedItem {
    return "tsdocComment" in item;
}

/**
 * Returns the documentation for the given API item, or `undefined` if the item
 * has no documentation.
 *
 * @internal
 */
export function documentation(node: ApiItem | undefined): string | undefined {
    if (node && isDocumentedItem(node)) {
        const { tsdocComment } = node;
        return renderNode(tsdocComment?.summarySection).trim();
    } else {
        return undefined;
    }
}

/**
 * Same as `documentation()`, but returns the documentation as a TSDoc comment
 * block.
 *
 * @internal
 */
export function documentationComment(
    node: ApiItem | undefined,
): string | undefined {
    const doc = documentation(node);
    if (doc === undefined) {
        return undefined;
    }

    if (!doc) {
        return "";
    }

    const lines = doc.split("\n");
    const commentLines = lines.map((line) => (line ? ` * ${line}` : ` *`));

    return ["/**", ...commentLines, " */"].join("\n");
}

function renderNode(docNode: DocNode | undefined): string {
    let result: string = "";
    if (docNode) {
        if (docNode instanceof DocExcerpt) {
            result += docNode.content.toString();
        }
        for (const childNode of docNode.getChildNodes()) {
            result += renderNode(childNode);
        }
    }
    return formatMarkdownLists(result);
}

function formatMarkdownLists(text: string): string {
    /* API Extractor condenses lists to `"- foo - bar - baz"`, this restores the
     * lists to proper markdown lists again */
    return text.replace(/(\S)[^\S\n]+([*-])[^\S\n]+/g, "$1\n$2 ");
}
