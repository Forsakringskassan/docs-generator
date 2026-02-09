/**
 * @internal
 */
export interface SearchEntry {
    url: string;
    title: string;
    type: "article" | "component" | "api";
    terms: string[];
    words: string[];
}
