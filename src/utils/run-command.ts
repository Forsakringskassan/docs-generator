import { exec } from "node:child_process";

/**
 * @internal
 * @param cmd - Command to run
 */
export function runCommand(cmd: string): Promise<string | undefined>;
export function runCommand<T>(
    cmd: string,
    defaultValue: T,
): Promise<string | T>;
export function runCommand<T>(
    cmd: string,
    defaultValue?: T,
): Promise<string | undefined | T> {
    return new Promise((resolve) => {
        exec(cmd, { encoding: "utf-8" }, (error, stdout) => {
            if (error) {
                /* eslint-disable-next-line no-console -- expected to log */
                console.error(error);
                resolve(defaultValue);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}
