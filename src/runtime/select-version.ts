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

function isOutside(rect: DOMRect, point: { x: number; y: number }): boolean {
    if (point.y < rect.top || point.y > rect.top + rect.height) {
        return true;
    }
    if (point.x < rect.left || point.x > rect.left + rect.width) {
        return true;
    }
    return false;
}

function clickOutside(
    dialog: HTMLDialogElement | null,
    event: MouseEvent,
): void {
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

    return (await response.json()) as VersionResponse;
}

const getVersions = memoize(fetchVersions);

async function initVersionProcessor(): Promise<void> {
    const dialog = document.querySelector<HTMLDialogElement>("#version-dialog");
    const form = document.querySelector("#version");
    const dialogCloseButton = dialog?.querySelector("button");

    const { latest } = await getVersions();

    if (motd.enabled && latest !== current) {
        motd.showMessage({ message });
    }

    if (!dialog || !dialogCloseButton || !form) {
        return;
    }

    function clickListener(event: MouseEvent): void {
        clickOutside(dialog, event);
    }

    dialog.addEventListener("close", () => {
        document.body.removeEventListener("click", clickListener);
    });

    dialogCloseButton.addEventListener("click", () => {
        dialog.close();
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const versionList = document.querySelector("#version-list");
        try {
            const { versions } = await getVersions();
            updateVersionList(versionList, versions);
        } catch {
            setErrorMessage(versionList);
        }
        dialog.showModal();
        document.body.addEventListener("click", clickListener);
    });
}

function updateVersionList(element: Element | null, versions: string[]): void {
    if (!element) {
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

    element.innerHTML = "";
    element.appendChild(ul);
}

function setErrorMessage(element: Element | null): void {
    if (!element) {
        return;
    }
    const p = document.createElement("p");
    p.innerText = "Det gick inte att hitta några tidigare versioner!";
    element.innerHTML = "";
    element.appendChild(p);
}

/* eslint-disable-next-line @typescript-eslint/no-floating-promises -- technical debt */
initVersionProcessor();

window.addEventListener("docs:navigation", () => {
    /* eslint-disable-next-line @typescript-eslint/no-floating-promises -- technical debt */
    initVersionProcessor();
});
