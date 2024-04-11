const replacements = {
    å: "a",
    ä: "a",
    ö: "o",
};

function findVersion(text: string): [number, number, number] | null {
    const match = text.match(/(\d+)\.(\d+)\.(\d+) \(\d+-\d+-\d+\)/);
    if (match) {
        return [
            parseInt(match[1], 10),
            parseInt(match[2], 10),
            parseInt(match[3], 10),
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
    return text
        .toLowerCase()
        .trim()
        .replace(/[åäö]/g, (m) => replacements[m as keyof typeof replacements]) // åäö to aao
        .replace(/[^a-z0-9]+/g, "_") // non-alphanum to dashes
        .replace(/^_+/, "") // remove leading dashes
        .replace(/_+$/, ""); // remove trailing dashes
}
