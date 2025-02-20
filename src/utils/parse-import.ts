import path from "node:path";

export interface ParsedImport {
    filename: string;
    extension: string;
    comments: string[];
}

export function parseImport(raw: string): ParsedImport {
    const comments: string[] = [];
    let stripped = raw;
    let previous;
    do {
        previous = stripped;
        stripped = stripped.replace(/<!--.*?-->/gms, (match) => {
            comments.push(match);
            return "";
        });
    } while (stripped !== previous);
    const filename = stripped.trim();
    const extension = path.parse(filename).ext.slice(1);
    return {
        filename,
        extension,
        comments,
    };
}
