const replacements = {
    å: "a",
    ä: "a",
    ö: "o",
};

function findVersion(text: string): [number, number, number] | null {
    const match = /(\d+)\.(\d+)\.(\d+) \(\d+-\d+-\d+\)/.exec(text);
    if (match) {
        return [Number(match[1]), Number(match[2]), Number(match[3])];
    }
    return null;
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
    return text
        .toLowerCase()
        .trim()
        .replaceAll(
            /[äåö]/g,
            (m) => replacements[m as keyof typeof replacements],
        ) // åäö to aao
        .replaceAll(/[^\da-z]+/g, "_") // non-alphanum to dashes
        .replace(/^_+/, "") // remove leading dashes
        .replace(/_+$/, ""); // remove trailing dashes
}
