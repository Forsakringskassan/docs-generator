const RE_MATCH_SSH = /^(ssh:\/\/)?(?<user>[^@]+)@(?<host>[^:]+):(?<path>.*)$/;

/**
 * Get normalized URL to the repository (https).
 *
 * @internal
 */
export function getRepositoryUrl(url: string): string;
export function getRepositoryUrl(pkg: {
    repository?: { url?: string };
}): string | null;
export function getRepositoryUrl(
    value: string | { repository?: { url?: string } },
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
    const ssh = value.match(RE_MATCH_SSH);
    if (ssh) {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it will exist with this regex */
        const { host, path } = ssh.groups!;
        value = `https://${host}/${path}`;
    }

    /* strip out ".git" suffix if present */
    value = value.replace(/[.]git$/, "");

    return value;
}
