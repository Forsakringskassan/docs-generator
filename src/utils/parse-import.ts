import path from "node:path";

export interface ParsedImport {
    filename: string;
    extension: string;
    comments: string[];
}

export function parseImport(raw: string): ParsedImport {
    const comments: string[] = [];
    const stripped = raw.replace(/<!--.*?-->/gms, (match) => {
        comments.push(match);
        return "";
    });
    const filename = stripped.trim();
    const extension = path.parse(filename).ext.slice(1);
    return {
        filename,
        extension,
        comments,
    };
}
