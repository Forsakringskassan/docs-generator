import { type SearchEntry } from "./search-entry";
import { type SearchIndex } from "./search-index";

/**
 * @internal
 */
export function generateIndex(entries: SearchEntry[]): SearchIndex {
    const index: SearchIndex = {
        terms: [],
        results: [],
        mapping: {},
    };
    for (const entry of entries) {
        index.results.push({
            url: entry.url,
            title: entry.title,
        });
        const resultIndex = index.results.length - 1;
        for (const word of entry.words) {
            index.terms.push(word);
            const termIndex = index.terms.length - 1;
            index.mapping[termIndex] = resultIndex;
        }
    }
    return index;
}
