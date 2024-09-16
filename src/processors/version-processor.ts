import { type PackageJson } from "../package-json";
import { type Processor } from "../processor";
import {
    getPullRequestID,
    getRepositoryUrl,
    gitCommitHash,
    interpolate,
    runCommand,
} from "../utils";

/**
 * Options for {@link versionProcessor}.
 *
 * @public
 */
export interface VersionProcessorOptions {
    readonly enabled: boolean;
    readonly scm?: {
        readonly commitUrlFormat: string;
        readonly prUrlFormat: string;
    };
}

/**
 * @internal
 */
export interface VersionProcessorTemplateData {
    readonly pkg: PackageJson;
    readonly scm: {
        readonly branch: string;
        readonly commitUrl: string;
        readonly commitShort: string;
        readonly commitHash: string;
        readonly pr: string | undefined;
        readonly prUrl: string | undefined;
    } | null;
    readonly build: {
        date: string;
        time: string;
    };
}

type ScmOptions = NonNullable<VersionProcessorOptions["scm"]>;

interface GitData {
    readonly branch: string;
    readonly commitUrl: string;
    readonly commitShort: string;
    readonly commitHash: string;
    readonly pr: string | undefined;
    readonly prUrl: string | undefined;
}

async function getGitBranch(): Promise<string> {
    /* jenkins doesn't checkout using branch name so cant fetch using normal
     * method but instead puts the branch name in environmental variables */
    const { CHANGE_BRANCH, CHANGE_NAME } = process.env;
    if (CHANGE_BRANCH) {
        return CHANGE_BRANCH;
    }
    if (CHANGE_NAME) {
        return CHANGE_NAME;
    }
    const branch = await runCommand(
        "git rev-parse --abbrev-ref HEAD",
        "unknown",
    );
    if (branch === "HEAD" || branch === "") {
        return "unknown";
    } else {
        return branch;
    }
}

async function getSCMData(
    pkg: { homepage: string; repository?: { url?: string } },
    options: ScmOptions,
): Promise<GitData | null> {
    const commitHash = await gitCommitHash("full");
    const commitShort = await gitCommitHash("short");
    if (!commitHash || !commitShort) {
        return null;
    }

    const { homepage } = pkg;
    const repository = getRepositoryUrl(pkg) ?? "";
    const pr = getPullRequestID(process.env);
    const prUrl = pr
        ? interpolate(options.prUrlFormat, { homepage, pr, repository })
        : undefined;
    return {
        branch: await getGitBranch(),
        commitShort,
        commitHash,
        commitUrl: interpolate(options.commitUrlFormat, {
            hash: commitHash,
            short: commitShort,
            homepage,
            repository,
        }),
        pr,
        prUrl,
    };
}

function getBuildDatetime(): { date: string; time: string } {
    const date = new Date();
    return {
        date: date.toLocaleDateString("sv-SE"),
        time: date.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
}

/**
 * Injects the package name and version into the document.
 *
 * @public
 */
export function versionProcessor(
    pkg: { name: string; version: string; homepage: string },
    container: string,
    options?: VersionProcessorOptions,
): Processor {
    const { enabled = true, scm = false } = options ?? {};
    return {
        name: "version-processor",
        after: "generate-docs",
        async handler(context) {
            if (!enabled) {
                return;
            }
            const scmData = scm ? await getSCMData(pkg, scm) : null;
            const buildData = getBuildDatetime();
            const data: VersionProcessorTemplateData = {
                pkg,
                scm: scmData,
                build: buildData,
            };
            context.addTemplateBlock(container, "version", {
                filename: "partials/version.njk.html",
                data,
            });
        },
    };
}
