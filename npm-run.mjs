/**
 * Wrapper around "npm run" with support for "--scope".
 *
 * The `--scope` argument takes a workspace or workspace glob pattern and runs
 * the script on each matching workspace.
 */

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import pkg from "./package.json" with { type: "json" };

/**
 * @param {string} value
 * @returns {Promise<string[]>}
 */
async function expandPattern(value) {
    const pattern = path.join(value, "/package.json");
    const files = await Array.fromAsync(fs.glob(pattern));
    return files.map(path.dirname);
}

/**
 * @param {string[]} patterns
 * @returns {Promise<string[]>}
 */
async function findWorkspaces(patterns) {
    const workspaces = await Promise.all(patterns.map(expandPattern));
    return workspaces.flat();
}

/**
 * @param {string[]} workspaces
 * @param {string} scope
 * @returns {string[]}
 */
function filter(workspaces, scope) {
    return workspaces.filter((workspace) => {
        return path.matchesGlob(workspace, scope);
    });
}

/* iterate over each given parameter and replace each `--scope=PATTERN` glob
 * pattern with expanded `--workspace=WORKSPACE` (one for each matching
 * workspace). */
const workspaces = await findWorkspaces(pkg.workspaces);
const args = process.argv.slice(2).map((it) => {
    if (it.startsWith("--scope=")) {
        const scope = it.slice("--scope=".length);
        const matches = filter(workspaces, scope);
        if (matches.length === 0) {
            throw new Error(`No workspaces matches scope "${scope}"`);
        }
        return matches.map((it) => ["--workspace", it]);
    }
    return it;
});

/* create the full commandline "npm run ARGS" */
const depth = 2;
const commandline = [
    process.platform === "win32" ? "npm.cmd" : "npm",
    "run",
    ...args.flat(depth),
];

/* on windows we must launch a new shell for the batch file to work (it's either
 * this or use the "shell" option but we are working with user input and with
 * input potentially containing spaces so this seems more safe) */
if (process.platform === "win32") {
    commandline.unshift("cmd.exe", "/c");
}

/* get effective command and arguments (command will be "npm" on posix and
 * "cmd.exe" on windows) */
const [cmd, ...argv] = commandline;

/* execute command line */
spawn(cmd, argv, {
    stdio: "inherit",
}).on("close", (code) => {
    process.exitCode = code ?? 1;
});
