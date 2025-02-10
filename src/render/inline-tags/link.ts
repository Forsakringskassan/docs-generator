import path from "node:path/posix";
import { type DocumentPage, isDocumentPage } from "../../document";
import { SoftError } from "../soft-error";
import { getOutputFilePath, findDocument } from "../../utils";
import { type InlineTag } from "./inline-tag";

function getRelativeUrl(from: DocumentPage, to: DocumentPage): string {
    const fromResolved = getOutputFilePath(".", from.fileInfo);
    const toResolved = getOutputFilePath(".", to.fileInfo);
    if (!fromResolved || !toResolved) {
        throw new Error("Cannot create link to document with no output");
    }

    const fromDir = path.dirname(fromResolved);
    const toDir = path.dirname(toResolved);
    const relative = path.relative(fromDir, toResolved);
    if (fromDir === toDir) {
        return relative === "index.html" ? "./" : `./${relative}`;
    } else if (relative.endsWith("/index.html")) {
        return path.dirname(relative);
    } else {
        return relative;
    }
}

function getLinkTitle(
    doc: DocumentPage,
    key: string,
    explicitTitle?: string,
): string {
    if (explicitTitle) {
        return explicitTitle;
    }
    const { title, component } = doc.attributes;
    if (component && component.some((it) => it.name === key)) {
        return `<code>${key}</code>`;
    } else {
        return title ?? doc.name;
    }
}

export const linkTag: InlineTag = {
    name: "link",
    description: "Create a link to another document",
    handler(doc, docs, content) {
        const match = content.match(/^([^\s#]+)(#\S+)?\s*(.+)?$/);
        if (!match) {
            throw new SoftError(
                "ELINKFORMAT",
                `Failed to parse link "${content}"`,
            );
        }
        const [, key, hash, explicitTitle] = match;

        if (key.startsWith("http://") || key.startsWith("https://")) {
            return `<a href="${key}${hash ?? ""}">${explicitTitle ?? key}</a>`;
        }

        const linked = findDocument(docs, key);
        if (!linked) {
            throw new SoftError(
                "ELINKTARGET",
                `Failed to find linked document "${key}"`,
                {
                    key,
                    hash,
                    title: explicitTitle,
                },
            );
        }

        /* if the document we are trying to linkt to is not a page document we
         * cannot link to it as we don't know the url (i.e. what page it exists
         * on or even if it is included on any page at all)
         */
        if (!isDocumentPage(linked)) {
            throw new SoftError(
                "ELINKPARTIAL",
                `Cannot link to partial document "${key}"`,
                {
                    key,
                    hash,
                    title: explicitTitle,
                },
            );
        }

        const url = getRelativeUrl(doc, linked);
        const title = getLinkTitle(linked, key, explicitTitle);
        return `<a href="${url}${hash ?? ""}">${title}</a>`;
    },
};
