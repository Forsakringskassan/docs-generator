import fs from "node:fs";
import path from "node:path";
import { type DocumentPage, type FileInfo } from "../document";
import { templateDirectory } from "./template-directory";

class MissingTemplateError extends Error {
    private searchDir: string[];

    public constructor(
        fileInfo: FileInfo,
        template: string,
        format: string,
        searchDir: string[],
    ) {
        const message = `Failed to find template "${template}" (${format} format) when rendering "${fileInfo.fullPath}"`;
        super(message);
        this.name = "MissingTemplateError";
        this.searchDir = searchDir;
    }

    public prettyError(): string {
        return [
            this.message,
            "",
            "Searched the following directories:",
            ...this.searchDir.map((it) => `  - ${it}`),
        ].join("\n");
    }
}

const cache = new Map<string, string>();

function cacheKey(layout: string, extension: "html" | "json"): string {
    return [layout, extension].join("|");
}

/**
 * @internal
 * @param from - Which document requested this template (for logging/debugging).
 */
export function findTemplate(
    folders: string[],
    from: FileInfo,
    doc: DocumentPage,
): string;
export function findTemplate(
    folders: string[],
    from: FileInfo,
    layout: string,
    format?: "html" | "json",
): string;
export function findTemplate(
    folders: string[],
    from: FileInfo,
    src: DocumentPage | string,
    format?: "html" | "json",
): string {
    let layout: string;

    if (typeof src === "string") {
        layout = src;
        format ??= "html";
    } else {
        layout = src.template;
        format = src.format !== "json" ? "html" : "json";
    }

    const key = cacheKey(layout, format);
    const cached = cache.get(key);
    if (cached) {
        return cached;
    }

    folders = [...folders, templateDirectory];
    const template = `${layout}.template.${format}`;
    const searchPaths = folders.map((it) => {
        return path.join(it, template);
    });
    const found = searchPaths.find((it) => fs.existsSync(it));
    if (!found) {
        throw new MissingTemplateError(from, template, format, folders);
    }

    cache.set(key, template);
    return template;
}
