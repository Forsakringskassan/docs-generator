import { type DocNode, DocExcerpt } from "@microsoft/tsdoc";

/**
 * @internal
 */
export function renderDocNode(docNode: DocNode | undefined): string {
    let result: string = "";
    if (docNode) {
        if (docNode instanceof DocExcerpt) {
            result += docNode.content.toString();
        }
        for (const childNode of docNode.getChildNodes()) {
            result += renderDocNode(childNode);
        }
    }
    return result;
}
