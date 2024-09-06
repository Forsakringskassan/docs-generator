import semver from "semver";
import { getUrl, memoize } from "./utils";

interface VersionResponse {
    versions: string[];
}

const dialog = document.querySelector<HTMLDialogElement>("#version-dialog");
const dialogCloseButton = dialog?.querySelector<HTMLDialogElement>("button");
const form = document.querySelector<HTMLFormElement>("#version");
const versionList = document.querySelector<HTMLUListElement>("#version-list");

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
    if (!dialog) {
        return;
    }

    const rect = dialog.getBoundingClientRect();
    const point = { x: event.clientX, y: event.clientY };

    if (isOutside(rect, point)) {
        dialog.close();
    }
}

async function fetchVersions(): Promise<string[]> {
    const url = getUrl(document, "../versions.json");
    const response = await fetch(url);
    const data: VersionResponse = await response.json();
    return data.versions;
}

const getVersions = memoize(fetchVersions);

function initVersionProcessor(): void {
    if (!dialog || !dialogCloseButton || !form) {
        return;
    }

    dialog.addEventListener("close", () => {
        document.body.removeEventListener("click", clickOutside);
    });

    dialogCloseButton.addEventListener("click", () => {
        dialog.close();
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            const versions = await getVersions();
            updateVersionList(versions);
        } catch {
            setErrorMessage();
        }
        dialog.showModal();
        document.body.addEventListener("click", clickOutside);
    });
}

function updateVersionList(versions: string[]): void {
    if (!versionList) {
        return;
    }

    const sortedVersions = ["latest", ...semver.rsort(versions)];

    /* eslint-disable @typescript-eslint/no-non-null-assertion -- if we've come this far, it probably exists. */
    const ul = document.createElement("ul");
    const template =
        document.querySelector<HTMLTemplateElement>(`#version-list-item`)!;
    for (const version of sortedVersions) {
        const item = template.content.cloneNode(true) as HTMLLIElement;
        const a = item.querySelector("a")!;
        a.href = getUrl(document, `../${version}`);
        a.textContent = version;
        ul.appendChild(item);
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    versionList.innerHTML = "";
    versionList.appendChild(ul);
}

function setErrorMessage(): void {
    if (!versionList) {
        return;
    }
    const p = document.createElement("p");
    p.innerText = "Det gick inte att hitta några tidigare versioner!";
    versionList.innerHTML = "";
    versionList.appendChild(p);
}

initVersionProcessor();
