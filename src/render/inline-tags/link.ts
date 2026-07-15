import path from "node:path/posix";
import { type DocumentPage, isDocumentPage } from "../../document";
import { type LinkResolver } from "../../link-resolver";
import { findDocument, getOutputFilePath } from "../../utils";
import { SoftError } from "../soft-error";
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
    }
    if (relative.endsWith("/index.html")) {
        return path.dirname(relative);
    }
    return relative;
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
    if (component?.some((it) => it.name === key)) {
        return `<code>${key}</code>`;
    }
    return title ?? doc.name;
}

function renderLink(link: {
    href: string;
    title: string;
    rel?: "external";
}): string {
    const { href, title, rel } = link;
    const attrs = new Map<string, string>();
    if (rel) {
        attrs.set("rel", rel);
    }
    const serialized = attrs
        .entries()
        .map(([key, value]) => ` ${key}="${value}"`)
        .toArray()
        .join("");
    return `<a href="${href}"${serialized}>${title}</a>`;
}

export function linkTag(linkResolvers: LinkResolver[]): InlineTag {
    return {
        name: "link",
        description: "Create a link to another document",
        handler(doc, docs, content) {
            /* eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-misleading-capturing-group -- technical debt */
            const match = /^([^\s#]+)(#\S+)?\s*(.+)?$/.exec(content);
            if (!match) {
                throw new SoftError(
                    "ELINKFORMAT",
                    `Failed to parse link "${content}"`,
                );
            }
            const key = match[1];
            const hash = match[2] as string | undefined;
            const explicitTitle = match[3] as string | undefined;

            /* trim leading pipe (tsdoc compatibility) if present */
            const normalizedTitle = explicitTitle?.replace(/^[\\|]\s*/, "");

            if (key.startsWith("http://") || key.startsWith("https://")) {
                return renderLink({
                    href: `${key}${hash ?? ""}`,
                    title: normalizedTitle ?? key,
                });
            }

            const { document: linked } = findDocument(docs, key);

            /* run all link resolvers, if one resolves it use the first result */
            const linkData = {
                key,
                hash: hash ?? null,
                title: normalizedTitle ?? null,
                doc: linked,
            };
            const resolved = linkResolvers
                .values()
                .map((it) => it(linkData))
                .find(Boolean);
            if (resolved) {
                return renderLink(resolved);
            }

            if (!linked) {
                throw new SoftError(
                    "ELINKTARGET",
                    `Failed to find linked document "${key}"`,
                    {
                        key,
                        hash,
                        title: normalizedTitle,
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
                        title: normalizedTitle,
                    },
                );
            }

            const url = getRelativeUrl(doc, linked);
            const title = getLinkTitle(linked, key, normalizedTitle);
            return renderLink({
                href: `${url}${hash ?? ""}`,
                title,
            });
        },
    };
}
