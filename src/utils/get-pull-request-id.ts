/**
 * @internal
 */
export interface BuildEnv {
    /** Jenkins */
    JOB_BASE_NAME?: string;

    /** Github Actions */
    GITHUB_REF?: string;
}

/**
 * @internal
 */
export function getPullRequestID(
    env: BuildEnv | typeof process.env,
): string | undefined {
    /* jenkins */
    if (env.JOB_BASE_NAME) {
        const name = env.JOB_BASE_NAME;
        const match = /^PR-(\d+)$/.exec(name);
        return match ? match[1] : undefined;
    }

    /* github actions */
    if (env.GITHUB_REF) {
        const name = env.GITHUB_REF;
        const match = /^refs\/pull\/([^/]+)\/merge$/.exec(name);
        return match ? match[1] : undefined;
    }

    return undefined;
}
