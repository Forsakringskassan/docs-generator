import fs from "node:fs/promises";
import path, { type ParsedPath } from "node:path";
import fm from "front-matter";
import {
    Component,
    DocumentBadge,
    type Document,
    type DocumentAttributes,
} from "../document";
import { getDocumentOutline, normalizePath } from "../utils";

function toArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}

function isIndexPage(parsed: ParsedPath): boolean {
    const folder = path.basename(parsed.dir);

    /* if the filename is the same as the folder it lives in this is considered the index page */
    if (parsed.name === folder) {
        return true;
    }

    /* if the filename is readme it is considered the index page */
    if (parsed.name.toLowerCase() === "readme") {
        return true;
    }

    /* if the filename is index it is considered the index page */
    if (parsed.name === "index") {
        return true;
    }

    return false;
}

function getBadge(attrs: DocumentAttributes): DocumentBadge | undefined {
    if (!attrs.status) {
        return undefined;
    }
    switch (attrs.status) {
        case "Produktionsklar":
            return "success";
        case "Deprekerad":
        case "Experimentell":
            return "error";
        case "Preliminär":
        case "Draft":
        case "Beta":
            return "info";
        default:
            return "info";
    }
}

function getComponentAlias(attrs: DocumentAttributes): string[] {
    if (attrs.component) {
        return toArray(attrs.component).map((it) => `component:${it}`);
    } else {
        return [];
    }
}

function getComponent(attrs: DocumentAttributes): Component[] | undefined {
    if (!attrs.component) {
        return undefined;
    }
    return toArray(attrs.component).map((it) => {
        if (typeof it === "string") {
            return {
                name: it,
            };
        } else {
            return it;
        }
    });
}

/**
 * @internal
 */
export function parseFile(
    filePath: string,
    basePath: string | undefined,
    content: string,
): Document {
    const relative = basePath
        ? path.relative(basePath, normalizePath(filePath))
        : normalizePath(filePath);
    const parsed = path.parse(relative);
    const blocks = fm<DocumentAttributes>(content);
    const attributes = blocks.attributes;
    const isIndex = isIndexPage(parsed);
    const filename = isIndex ? "index" : parsed.name.toLowerCase();
    const name = attributes.name ? attributes.name : parsed.name;
    const urlpath = parsed.dir;
    const outline = getDocumentOutline(blocks.body, "markdown");
    const include = attributes.include ?? true;
    return {
        id: `fs:${filePath.replace(/\\/g, "/")}`,
        name,
        alias: [...getComponentAlias(attributes)],
        visible: attributes.visible ?? true,
        attributes: {
            title: attributes.title ?? name,
            layout: attributes.layout,
            status: attributes.status,
            badge: getBadge(attributes),
            component: getComponent(attributes),
            sortorder: attributes.sortorder ?? Infinity,
        },
        body: blocks.body,
        outline,
        format: "markdown",
        tags: [],
        template: blocks.attributes.layout ?? "default",
        fileInfo: {
            path: ["", "."].includes(urlpath)
                ? "."
                : `./${normalizePath(urlpath)}`,
            name: filename,
            fullPath: normalizePath(filePath),
            outputName: include ? `${filename}.html` : false,
        },
    };
}

/**
 * Read a Markdown file with Front Matter.
 *
 * @public
 */
/* istanbul ignore next */
export async function frontMatterFileReader(
    filePath: string,
    basePath?: string,
): Promise<Document[]> {
    const content = await fs.readFile(filePath, "utf-8");
    const doc = parseFile(filePath, basePath, content);
    return [doc];
}
