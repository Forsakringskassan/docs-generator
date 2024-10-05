import { type InlineTag } from "./inline-tag";
import { linkTag } from "./link";
import { optionalTag } from "./optional";

export { type InlineTag } from "./inline-tag";

const inlineTags: InlineTag[] = [linkTag, optionalTag];

export default inlineTags;
