import fs from "node:fs/promises";
import path, { type ParsedPath } from "node:path";
import fm from "front-matter";
import {
    type ComponentAttribute,
    type DocumentAttributes,
    type DocumentBadge,
    type DocumentPage,
    documentAttributeKeys,
} from "../document";
import { getDocumentOutline, normalizePath } from "../utils";
import { AttributeError } from "./attribute-error";

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

function validateAttributes(
    attributes: DocumentAttributes,
    filePath: string,
    content: string,
): void {
    /* @todo json schema validation would make more sense but for now this is good enough */
    for (const key of Object.keys(attributes)) {
        if (documentAttributeKeys.includes(key)) {
            continue;
        }
        throw new AttributeError({
            attribute: key,
            filePath,
            content,
        });
    }
}

function normalizeComponent(
    value: string | ComponentAttribute,
): ComponentAttribute {
    if (typeof value === "string") {
        return {
            name: value,
        };
    } else {
        return value;
    }
}

function getComponentAlias(value: string | ComponentAttribute): string {
    const { name } = normalizeComponent(value);
    return `component:${name}`;
}

/**
 * @internal
 */
export function* getDocumentAlias(
    attrs: DocumentAttributes,
): Generator<string> {
    if (attrs.alias) {
        yield* toArray(attrs.alias);
    }
    if (attrs.component) {
        yield* toArray(attrs.component).map(getComponentAlias);
    }
}

function getComponent(
    attrs: DocumentAttributes,
): ComponentAttribute[] | undefined {
    if (!attrs.component) {
        return undefined;
    }
    return toArray(attrs.component).map(normalizeComponent);
}

/**
 * @internal
 */
export function parseFile(
    filePath: string,
    basePath: string | undefined,
    content: string,
): DocumentPage {
    const relative = basePath
        ? path.relative(basePath, normalizePath(filePath))
        : normalizePath(filePath);
    const parsed = path.parse(relative);
    const blocks = fm<DocumentAttributes>(content);
    const attributes = blocks.attributes;
    const isIndex = isIndexPage(parsed);
    const filename = isIndex ? "index" : parsed.name.toLowerCase();
    const name = attributes.name ?? parsed.name;
    const urlpath = parsed.dir;
    const outline = getDocumentOutline(blocks.body, "markdown");
    const include = attributes.include ?? true;

    validateAttributes(attributes, filePath, content);

    return {
        kind: "page",
        id: `fs:${filePath.replace(/\\/g, "/")}`,
        name,
        alias: Array.from(getDocumentAlias(attributes)),
        visible: attributes.visible ?? true,
        attributes: {
            title: attributes.title ?? name,
            shortTitle: attributes["short-title"],
            layout: attributes.layout,
            status: attributes.status,
            badge: getBadge(attributes),
            component: getComponent(attributes),
            redirectFrom: toArray(attributes.redirect_from ?? []),
            search: {
                terms: toArray(attributes.search?.terms ?? []),
            },
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
): Promise<DocumentPage[]> {
    const content = await fs.readFile(filePath, "utf-8");
    const doc = parseFile(filePath, basePath, content);
    return [doc];
}
