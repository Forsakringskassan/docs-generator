export interface SearchIndex {
    /* list of all possible search terms */
    terms: string[];
    /* list of all possible search results */
    results: Array<{ url: string; title: string }>;
    /* mapping between terms and resutls (index -> index) */
    mapping: Record<number, number>;
}
