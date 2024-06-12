import scrollIntoView from "scroll-into-view-if-needed";
import uFuzzy from "@leeoniya/ufuzzy";
import { type SearchIndex } from "../search";

/* eslint-disable @typescript-eslint/no-non-null-assertion -- let it crash at runtime if these doesn't actually exist */
const url = document.querySelector("#search-data")!.getAttribute("href")!;
const dialog = document.querySelector<HTMLDialogElement>("#search-dialog")!;
const button = document.querySelector<HTMLButtonElement>("#search")!;
const input = document.querySelector<HTMLButtonElement>("#search-field")!;
const form = document.querySelector<HTMLButtonElement>("#search-form")!;
const results = document.querySelector<HTMLButtonElement>("#search-results")!;
/* eslint-enable @typescript-eslint/no-non-null-assertion */

let index: SearchIndex | null = null;
let searchTerm = "";
let active = 0;
const uf = new uFuzzy({
    intraIns: Infinity,
});

function updateResults(): void {
    if (!index || searchTerm === "") {
        results.innerHTML = "";
        return;
    }

    const idxs = uf.filter(index.terms, searchTerm);
    if (!idxs) {
        results.innerHTML = "";
        return;
    }

    const info = uf.info(idxs, index.terms, searchTerm);
    const order = uf.sort(info, index.terms, searchTerm);

    active = 0;

    const rootUrl = document.documentElement.dataset.rootUrl ?? ".";
    const ul = document.createElement("ul");
    ul.classList.add("list");
    for (let i = 0; i < order.length; i++) {
        const infoIdx = order[i];
        const termIdx = info.idx[infoIdx];
        const resultIdx = index.mapping[termIdx];
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.innerHTML = uFuzzy.highlight(
            index.terms[termIdx],
            info.ranges[infoIdx],
        );
        a.href = [rootUrl, index.results[resultIdx].url].join("/");
        a.classList.add("list__item__itempane");
        li.classList.add("list__item");
        li.classList.toggle("list__item--active", i === active);
        li.appendChild(a);
        ul.appendChild(li);
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

function isOutside(rect: DOMRect, point: { x: number; y: number }): boolean {
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
