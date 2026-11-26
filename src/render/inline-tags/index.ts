import { type LinkResolver } from "../../link-resolver";
import { type InlineTag } from "./inline-tag";
import { linkTag } from "./link";
import { optionalTag } from "./optional";
import { variableTag } from "./variable";

export { type InlineTag } from "./inline-tag";

function inlineTags(
    linkResolvers: LinkResolver[],
    templateData: Record<string, unknown>,
): InlineTag[] {
    return [linkTag(linkResolvers), variableTag(templateData), optionalTag];
}

export default inlineTags;
