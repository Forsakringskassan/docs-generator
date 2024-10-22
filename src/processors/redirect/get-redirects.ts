import { type Document } from "../../document";
import { normalizePath } from "../../utils";

/**
 * @internal
 */
export interface Redirect {
    from: string;
    to: string;
}

/**
 * @internal
 */
export function getRedirects(docs: Document[]): Redirect[] {
    return docs
        .map((it): Redirect[] => {
            const { fileInfo } = it;
            const { path, outputName } = fileInfo;
            if (outputName === false) {
                return [];
            }
            return it.attributes.redirectFrom.map((jt) => {
                return {
                    from: jt.startsWith("/") ? jt.slice(1) : jt,
                    to: normalizePath(path, outputName),
                };
            });
        })
        .flat();
}
