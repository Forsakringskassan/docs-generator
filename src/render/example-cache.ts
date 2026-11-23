import {
    copyFileSync,
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
} from "node:fs";
import path from "node:path";
import { type CompileResult, type ExampleCompileTask } from "../examples";

const INPUTS_CACHE_DIR = "temp/example-inputs";

function readCachedInputs(
    docPath: string,
    outputFile: string,
): Set<string> | null {
    const metaFile = path.join(INPUTS_CACHE_DIR, docPath, `${outputFile}.json`);
    if (!existsSync(metaFile)) {
        return null;
    }
    try {
        const raw = readFileSync(metaFile, "utf8");
        const parsed = JSON.parse(raw) as string[];
        return new Set(parsed);
    } catch {
        return null;
    }
}

/**
 * Save compiled example input dependencies to disk cache.
 *
 * @internal
 */
export function writeCachedInputs(
    docPath: string,
    outputFile: string,
    inputs: Iterable<string>,
): void {
    const metaFile = path.join(INPUTS_CACHE_DIR, docPath, `${outputFile}.json`);
    mkdirSync(path.dirname(metaFile), { recursive: true });
    writeFileSync(metaFile, JSON.stringify(Array.from(inputs)), "utf8");
}

/**
 * Split example tasks into already-cached results and dirty tasks that need compilation.
 *
 * @internal
 */
export function partitionCachedTasks(
    tasks: ExampleCompileTask[],
    docPath: string,
    cacheFolder: string,
    outputFolder: string,
): { cachedResults: CompileResult[]; dirtyTasks: ExampleCompileTask[] } {
    const cachedResults: CompileResult[] = [];
    const dirtyTasks: ExampleCompileTask[] = [];

    for (const task of tasks) {
        const cacheFile = path.join(cacheFolder, task.outputFile);
        const outputFile = path.join(outputFolder, task.outputFile);
        const cachedInputs = readCachedInputs(docPath, task.outputFile);

        if (existsSync(cacheFile) && cachedInputs) {
            copyFileSync(cacheFile, outputFile);
            cachedResults.push({ ...task, inputs: cachedInputs });
        } else {
            dirtyTasks.push(task);
        }
    }

    return { cachedResults, dirtyTasks };
}
