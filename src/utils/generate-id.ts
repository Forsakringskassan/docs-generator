const replacements = {
    å: "a",
    ä: "a",
    ö: "o",
};

function findVersion(text: string): [number, number, number] | null {
    /* eslint-disable-next-line sonarjs/slow-regex -- technical debt */
    const match = /(\d+)\.(\d+)\.(\d+) \(\d+-\d+-\d+\)/.exec(text);
    if (match) {
        return [
            Number.parseInt(match[1], 10),
            Number.parseInt(match[2], 10),
            Number.parseInt(match[3], 10),
        ];
    } else {
        return null;
    }
}

/**
 * Generate a URL safe id from a text, suitable to use with headings etc.
 *
 * @internal
 */
export function generateId(text: string): string {
    const version = findVersion(text);
    if (version) {
        return `v${version.join("-")}`;
    }
    return (
        text
            .toLowerCase()
            .trim()
            .replaceAll(
                /[äåö]/g,
                (m) => replacements[m as keyof typeof replacements],
            ) // åäö to aao
            .replaceAll(/[^\da-z]+/g, "_") // non-alphanum to dashes
            .replace(/^_+/, "") // remove leading dashes
            /* eslint-disable-next-line sonarjs/slow-regex -- technical debt */
            .replace(/_+$/, "") // remove trailing dashes
    );
}
