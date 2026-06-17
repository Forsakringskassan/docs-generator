import { type Document } from "./document";

/**
 * Resolve a link from a `{@link ...}` tag.
 *
 * Link resolvers are processed in order, the first resolver returning a result
 * is used. If your resolver cannot resolve the link it must return `null` or
 * `undefined`.
 *
 * If the key matches a document (by id, name or alias) the document is passed
 * in as a parameter.
 *
 * @example
 * ```ts
 * const linkResolver: LinkResolver = ({ key, title }) => {
 *     if (key === "foo") {
 *         return {
 *             href: "https://example.net/foo",
 *             title,
 *             rel: "external",
 *         };
 *     }
 *     return null;
 * };
 * ```
 *
 * @public
 * @since %version%
 * @param link - Link data
 * @returns A resolved link or `null` or `undefined` if this resolver cannot
 * handle this link
 */
export type LinkResolver = (
    this: void,
    link: {
        /** Key (without hash) referenced by user */
        readonly key: string;
        /** Optional hash from key (includes the `#` prefix) */
        readonly hash: string | null;
        /** Optional explicit title requested by user */
        readonly title: string | null;
        /** Matching document if one was found */
        readonly doc: Document | null;
    },
) =>
    | {
          /** Link target (href attribute of the `<a>` element) */
          readonly href: string;
          /** Link text */
          readonly title: string;
          /** If given, the `rel` attribute is set with this value on the `<a>` element */
          readonly rel?: "external";
      }
    | undefined
    | null;
