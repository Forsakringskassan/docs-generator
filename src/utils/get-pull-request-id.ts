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
        const match = name.match(/^PR-(\d+)$/);
        return match ? match[1] : undefined;
    }

    /* github actions */
    if (env.GITHUB_REF) {
        const name = env.GITHUB_REF;
        const match = name.match(/^refs\/pull\/([^/]+)\/merge$/);
        return match ? match[1] : undefined;
    }

    return undefined;
}
