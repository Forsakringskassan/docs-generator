import scrollIntoView from "scroll-into-view-if-needed";
import uFuzzy from "@leeoniya/ufuzzy";
import { type SearchIndex } from "../search";

interface SearchResult {
    /** what the search result matched */
    matchType: "title" | "term";
    /** html markup with a highlighted text */
    highlighted: string;
    /** the literal word the search result matched */
    term: string;
    /** matched document */
    doc: {
        /** document title */
        title: string;
        /** document url (relative to root) */
        url: string;
    };
}

/**
 * Returns `true` if `a` is more specific than `b`
 */
function isMoreSpecific(a: SearchResult, b: SearchResult | null): boolean {
    if (b === null) {
        return true;
    }
    return a.matchType === "title" && b.matchType === "term";
}

function setup(): void {
    const searchData = document.querySelector("#search-data");
    if (!searchData) {
        return;
    }

    /* eslint-disable @typescript-eslint/no-non-null-assertion -- let it crash at runtime if these doesn't actually exist */
    const url = searchData.getAttribute("href")!;
    const dialog = document.querySelector<HTMLDialogElement>("#search-dialog")!;
    const button = document.querySelector<HTMLButtonElement>("#search")!;
    const input = document.querySelector<HTMLButtonElement>("#search-field")!;
    const form = document.querySelector<HTMLButtonElement>("#search-form")!;
    const results =
        document.querySelector<HTMLButtonElement>("#search-results")!;
    const resultTemplate = document.querySelector<HTMLTemplateElement>(
        "#search-result-template",
    )!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    let index: SearchIndex | null = null;
    let searchTerm = "";
    let active = 0;
    const uf = new uFuzzy({
        intraIns: Infinity,
    });

    /**
     * Get a list of search results for given text.
     *
     * @param searchTerm - The user-inputted text to search for
     */
    function getSearchResults(searchTerm: string): SearchResult[] {
        if (!index || searchTerm === "") {
            return [];
        }

        const idxs = uf.filter(index.terms, searchTerm);
        if (!idxs) {
            return [];
        }

        const info = uf.info(idxs, index.terms, searchTerm);
        const order = uf.sort(info, index.terms, searchTerm);
        const results: Array<SearchResult | null> = [];

        /* maps document url to result index */
        const documentMapping = new Map<string, number>();

        for (const infoIdx of order) {
            const termIdx = info.idx[infoIdx];
            const resultIdx = index.mapping[termIdx];
            const term = index.terms[termIdx];
            const result = index.results[resultIdx];
            const highlighted = uFuzzy.highlight(term, info.ranges[infoIdx]);

            const searchResult: SearchResult = {
                matchType: result.terms.includes(term) ? "term" : "title",
                highlighted,
                term,
                doc: {
                    title: result.title,
                    url: result.url,
                },
            };

            /* if there is a previous result for this document we see if this
             * match is more specific, only keeping the more specific one around
             * to avoid duplicates */
            if (documentMapping.has(result.url)) {
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- false positive, we just checked that it exists */
                const previousIndex = documentMapping.get(result.url)!;
                const previousResult = results[previousIndex];
                if (isMoreSpecific(searchResult, previousResult)) {
                    /* more specific than previous one, remove that one */
                    results[previousIndex] = null;
                } else {
                    /* less specific than previous result, skip this one */
                    continue;
                }
            }

            const resultIndex = results.length;
            documentMapping.set(result.url, resultIndex);

            results.push(searchResult);
        }

        return results.filter((it) => it !== null);
    }

    function updateResults(): void {
        const searchResults = getSearchResults(searchTerm);
        if (searchResults.length === 0) {
            results.innerHTML = "";
            return;
        }

        active = 0;

        const rootUrl = document.documentElement.dataset.rootUrl ?? ".";
        const ul = document.createElement("ul");
        ul.classList.add("list");
        for (let i = 0; i < searchResults.length; i++) {
            const { matchType, highlighted, doc } = searchResults[i];
            const row = resultTemplate.content.cloneNode(
                true,
            ) as DocumentFragment;
            /* eslint-disable @typescript-eslint/no-non-null-assertion -- let it crash at runtime if these doesn't actually exist */
            const li = row.querySelector("li")!;
            const a = row.querySelector("a")!;
            const typeElement = row.querySelector(".docs-searchresult__type")!;
            const matchElement = row.querySelector("[data-bind=match]")!;
            /* eslint-enable @typescript-eslint/no-non-null-assertion */

            for (const child of Array.from(typeElement.children)) {
                const svg = child as SVGElement;
                if (svg.dataset.type !== result.type) {
                    svg.remove();
                }
            }
            typeElement.querySelector(`[data-type=${result.type}]`);
            typeElement.classList.add(
                `docs-searchresult__type--${result.type}`,
            );

            if (matchType === "term") {
                matchElement.innerHTML = `${doc.title} (${highlighted})`;
            } else {
                matchElement.innerHTML = highlighted;
            }

            a.href = [rootUrl, doc.url].join("/");
            li.classList.toggle("list__item--active", i === active);
            ul.appendChild(row);
        }

        results.innerHTML = "";
        results.appendChild(ul);
    }

    function updateActive(items: HTMLElement[], active: number): void {
        items.forEach((item, index) => {
            item.classList.toggle("list__item--active", index === active);
        });

        const item = items[active];
        scrollIntoView(item, {
            scrollMode: "if-needed",
            block: "nearest",
            inline: "nearest",
        });
    }

    function isOutside(
        rect: DOMRect,
        point: { x: number; y: number },
    ): boolean {
        if (point.y < rect.top || point.y > rect.top + rect.height) {
            return true;
        }
        if (point.x < rect.left || point.x > rect.left + rect.width) {
            return true;
        }
        return false;
    }

    function clickOutside(event: MouseEvent): void {
        const rect = dialog.getBoundingClientRect();
        const point = { x: event.clientX, y: event.clientY };

        if (isOutside(rect, point)) {
            dialog.close();
        }
    }

    dialog.addEventListener("close", () => {
        document.body.removeEventListener("click", clickOutside);
    });

    fetch(url)
        .then((response) => response.json())
        .then((value: SearchIndex) => {
            index = value;
            updateResults();
        });

    button.addEventListener("submit", (event) => {
        event.preventDefault();
        input.value = searchTerm = "";
        dialog.showModal();
        document.body.addEventListener("click", clickOutside);
    });

    input.addEventListener("input", () => {
        searchTerm = input.value.toLowerCase();
        updateResults();
    });

    input.addEventListener("keydown", (event) => {
        const items = Array.from(results.querySelectorAll("li"));
        const n = items.length;

        if (n === 0) {
            return;
        }

        switch (event.key) {
            case "Down":
            case "ArrowDown":
                active = (active + 1) % n;
                updateActive(items, active);
                break;
            case "Up":
            case "ArrowUp":
                active = (active - 1 + n) % n;
                updateActive(items, active);
                break;
            default:
                return;
        }
        event.preventDefault();
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const items = Array.from(results.querySelectorAll("li"));
        const item = items[active].querySelector("a");
        if (item) {
            item.click();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === "k") {
            event.preventDefault();
            input.value = searchTerm = "";
            updateResults();
            dialog.showModal();
            document.body.addEventListener("click", clickOutside);
        }
    });
}

setup();
