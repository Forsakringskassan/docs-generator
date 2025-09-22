import path from "node:path/posix";
import { type Processor } from "../../processor";
import { getRedirects } from "./get-redirects";

/**
 * Creates stub documents with redirects suitable for creating a manifest.
 *
 * @internal
 */
export function redirectProcessor(): Processor {
    return {
        name: "redirect-processor",
        after: "generate-docs",
        handler(context) {
            const redirects = getRedirects(context.docs);
            for (const redirect of redirects) {
                const { dir, base, name } = path.parse(redirect.from);
                context.addDocument({
                    kind: "page",
                    id: `redirect:${redirect.from}-${redirect.to}`,
                    name: `${redirect.from}-${redirect.to}`,
                    alias: [],
                    visible: false,
                    attributes: {
                        sortorder: Infinity,
                        redirectFrom: [],
                        search: { terms: [] },
                    },
                    body: redirect.to,
                    outline: [],
                    format: "redirect",
                    tags: [],
                    template: "redirect",
                    fileInfo: {
                        path: dir,
                        name,
                        fullPath: "virtual:redirect",
                        outputName: base,
                    },
                });
            }
            const s = redirects.length === 1 ? "" : "s";
            context.log(redirects.length, `redirect${s} found`);
        },
    };
}
