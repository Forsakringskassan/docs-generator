import { type PackageJson } from "../package-json";

const RE_MATCH_SSH = /^(ssh:\/\/)?(?<user>[^@]+)@(?<host>[^:]+):(?<path>.*)$/;

/**
 * Get normalized URL to the repository (https).
 *
 * @internal
 */
export function getRepositoryUrl(url: string): string;
export function getRepositoryUrl(
    pkg: Pick<PackageJson, "repository">,
): string | null;
export function getRepositoryUrl(
    value: string | Pick<PackageJson, "repository">,
): string | null {
    if (typeof value !== "string") {
        const url = value.repository?.url;
        if (!url) {
            return null;
        }
        value = url;
    }

    /* strip out "git+" prefix if present */
    value = value.replace(/^git[+]/, "");

    /* convert ssh://user@host:org/repo to https://host/org/repo */
    const ssh = RE_MATCH_SSH.exec(value);
    if (ssh) {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it will exist with this regex */
        const { host, path } = ssh.groups!;
        value = `https://${host}/${path}`;
    }

    /* strip out ".git" suffix if present */
    value = value.replace(/[.]git$/, "");

    return value;
}
