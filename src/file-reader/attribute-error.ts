import { type SourceLocation, codeFrameColumns } from "@babel/code-frame";
import { closest, distance } from "fastest-levenshtein";
import { documentAttributeKeys } from "../document";

interface AttributeErrorOptions {
    attribute: string;
    filePath: string;
    content: string;
}

const threshold = 3;

/* manual suggestions for attributes where the name is not just a typo */
const suggestions: Partial<Record<string, string>> = {
    hidden: "visible",
};

/**
 * Hack to guess the line in the frontmatter block, it makes horrible
 * assumptions and will break down if anything than a simple flat structure is
 * used with attribute validation but it works good enough for now.
 *
 * Nested keys could be fixed by searching recursive though.
 *
 * @internal
 */
export function findLocation(
    content: string,
    attr: string,
): SourceLocation | null {
    const match = content.match(/^---\n(.*?)^---/ms);
    if (!match || match.index !== 0) {
        return null;
    }

    /* @todo would be better to actually parse the yaml block to an ast and get the location from there */
    const yaml = match[1];
    const lines = yaml.split("\n");
    const index = lines.findIndex((it) => it.startsWith(`${attr}:`)); // this makes horrible assumptions and will break
    if (index < 0) {
        return null;
    }

    const blockBegin = 2; // the first line of the frontmatter block is at line 2
    return {
        start: { line: index + blockBegin, column: 1 },
        end: { line: index + blockBegin, column: 1 + attr.length },
    };
}

function getSuggestion(attribute: string): [suggestion: string, d: number] {
    /* use manual suggestions if they exists */
    const manual = suggestions[attribute];
    if (manual) {
        return [manual, 0];
    }

    /* find typos */
    const closestKey = closest(attribute, documentAttributeKeys);
    const d = distance(attribute, closestKey);
    return [closestKey, d];
}

/**
 * @internal
 */
export class AttributeError extends Error {
    private readonly attribute: string;
    private readonly content: string;

    public constructor(options: AttributeErrorOptions) {
        const { attribute, filePath, content } = options;
        super(`Unknown attribute "${attribute}" in "${filePath}"`);
        this.name = "AttributeError";
        this.attribute = attribute;
        this.content = content;
    }

    public prettyError(): string {
        const { attribute, content, message } = this;

        const [closestMatch, d] = getSuggestion(attribute);
        const suggestion =
            d <= threshold
                ? `Did you mean to use "${closestMatch}"?`
                : `Unknown attribute "${attribute}"`;
        const location = findLocation(content, attribute);
        if (location) {
            const codeframe = codeFrameColumns(content, location, {
                message: suggestion,
            });
            return [message, "", codeframe].join("\n");
        } else if (d <= threshold) {
            return [message, "", suggestion].join("\n");
        } else {
            return message;
        }
    }
}
