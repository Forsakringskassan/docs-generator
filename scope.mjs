import fs from "node:fs/promises";
import path from "node:path/posix";
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
 * @param {string[]} scopes
 * @returns {string[]}
 */
function filter(workspaces, scopes) {
    return workspaces.filter((workspace) => {
        return scopes.some((scope) => path.matchesGlob(workspace, scope));
    });
}

const workspaces = await findWorkspaces(pkg.workspaces);
const scopes = process.argv.slice(2);
const filtered = scopes.length > 0 ? filter(workspaces, scopes) : workspaces;

for (const workspace of filtered) {
    console.log("-w", workspace);
}
