import { type LinkResolver } from "../../link-resolver";
import { type InlineTag } from "./inline-tag";
import { linkTag } from "./link";
import { optionalTag } from "./optional";

export { type InlineTag } from "./inline-tag";

function inlineTags(linkResolvers: LinkResolver[]): InlineTag[] {
    return [linkTag(linkResolvers), optionalTag];
}

export default inlineTags;
