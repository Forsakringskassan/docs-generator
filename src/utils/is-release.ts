import { execSync } from "node:child_process";

/**
 * Checks if the latest commit is a release commit.
 * @public
 * @returns if the latest commit is a release commit.
 */
export function isRelease(): boolean {
    try {
        const cmd = `git log -n1 --format=format:%s`;
        /* eslint-disable-next-line sonarjs/os-command -- want to execute git from PATH */
        const message = execSync(cmd, { encoding: "utf-8" }).trim();
        return message.startsWith("chore(release):");
    } catch (err) {
        /* eslint-disable-next-line no-console -- Print error if command fails */
        console.error(err);
        return false;
    }
}
