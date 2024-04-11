import {
    type DocumentOutline,
    type DocumentOutlineEntry,
} from "../document-outline";
import { generateId } from "./generate-id";

interface ParsedHeading {
    rank: number;
    title: string;
    anchor: string;
}

const matchHeading = /^(#+)(.*)$/gm;

function getHeadings(text: string): ParsedHeading[] {
    return Array.from(text.matchAll(matchHeading), parseHeading);
}

function parseHeading(match: RegExpMatchArray): ParsedHeading {
    const [, prefix, text] = match;
    const rank = prefix.length; // # -> 1, ## -> 2, etc
    const id = generateId(text);
    return {
        rank,
        title: text.trim(),
        anchor: id,
    };
}

/**
 * Get document outline (headings) from text.
 *
 * @public
 */
export function getDocumentOutline(
    text: string,
    _format: "markdown",
): DocumentOutline {
    const entries = getHeadings(text);

    /* Create a stack of heading levels starting at a "virtual" level 0, the
     * first heading is always inserted as a child to this virtal heading.*/
    const root = { title: "", rank: 0, anchor: "", subheadings: [] };
    const stack: DocumentOutlineEntry[] = [root];
    const top = (): DocumentOutlineEntry => stack[stack.length - 1];

    for (const entry of entries) {
        const heading: DocumentOutlineEntry = {
            title: entry.title,
            rank: entry.rank,
            anchor: entry.anchor,
            subheadings: [],
        };

        /* If the top entry of the stack has a higher rank we pop the stack
         * until we reach the first one with a lower rank. This includes
         * siblings with the same rank, e.g. a `##` following another `##` will
         * be inserted under the parent and not as a child of the previous
         * `##` */
        while (top().rank >= entry.rank) {
            stack.pop();
        }

        /* Insert this heading as a subheading of the current top of the stack
         * and push this heading as the current top so subsequent headings (with
         * higher rank) will be inserted as a child of this one */
        top().subheadings.push(heading);
        stack.push(heading);
    }

    /* All the subheadings of the virtual root heading will now be the document
     * outline */
    return root.subheadings;
}
