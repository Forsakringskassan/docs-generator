import semver from "semver";
import { getUrl, memoize } from "./utils";
import { motdProxy as motd } from "./motd/motd-proxy";

interface VersionResponse {
    latest: string;
    versions: string[];
}

declare const __PKG_VERSION__: string;
declare const __MESSAGE__: string;

const current = __PKG_VERSION__;
const message = __MESSAGE__;

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

async function fetchVersions(): Promise<VersionResponse> {
    const url = getUrl(document, `../versions.json?v=${current}`);

    const response = await fetch(url);

    if (!response.ok) {
        // eslint-disable-next-line no-console -- expected to log
        console.error("An error occured when loading versions.json.");

        return {
            latest: current,
            versions: [current],
        };
    }

    return await response.json();
}

const getVersions = memoize(fetchVersions);

async function initVersionProcessor(): Promise<void> {
    const { latest } = await getVersions();

    if (motd.enabled && latest !== current) {
        motd.showMessage({ message });
    }

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
            const { versions } = await getVersions();
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
