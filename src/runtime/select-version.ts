import semver from "semver";

const dialog = document.querySelector<HTMLDialogElement>("#version-dialog");
const dialogCloseButton = dialog?.querySelector<HTMLDialogElement>("button");
const form = document.querySelector<HTMLFormElement>("#version");
const versionList = document.querySelector<HTMLUListElement>("#version-list");
interface VersionResponse {
    versions: string[];
}

let docVersions: string[] | null = null;

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

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!docVersions) {
            fetch("/latest/versions.json", {})
                .then((response) => response.json())
                .then((data: VersionResponse) => {
                    docVersions = data.versions;
                    updateVersionList();
                })
                .catch(() => {
                    setErrorMessage();
                });
        }
        dialog.showModal();

        document.body.addEventListener("click", clickOutside);
    });
}

function updateVersionList(): void {
    if (!versionList) {
        return;
    }

    const sortedVersions = ["latest", ...semver.rsort(docVersions ?? [])];
    const ul = document.createElement("ul");
    const template =
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- if we've come this far, it probably exists.
        document.querySelector<HTMLFormElement>(`#version-list-item`)!;
    for (const version of sortedVersions) {
        const item = template.content.cloneNode(true);
        const a = item.querySelector("a");
        a.href = `/${version}/`;
        a.textContent = version;
        ul.appendChild(item);
    }

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
