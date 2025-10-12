import { type AddressInfo } from "net";
import path from "node:path/posix";
import { watch } from "chokidar";
import tinylr from "tiny-lr";
import { keypress } from "./keypress";
import { printMenu } from "./print-menu";

/**
 * @internal
 */
export interface ServeOptions {
    outputFolder: string;
    watch: string[];

    /**
     * Callback to rebuild all assets depending on given filePaths.
     *
     * @returns A promise resolving to a list of all output files affected.
     */
    rebuild(this: void, filePath: string[]): Promise<string[]>;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createRebuilder(
    callback: (filePath: string[]) => Promise<string[]>,
    livereload: (filePath: string[]) => void,
): (filePath: string) => void {
    let inflight = false;
    let queue: string[] = [];

    async function rebuild(filePath: string): Promise<void> {
        queue.push(filePath);

        /* if there is already a request being handled we exit out right await
         * (with the flag set) */
        if (inflight) {
            return;
        }

        /* mark that this request is doing a rebuild so no futher requests will
         * try to rebuild until this one is finised */
        inflight = true;

        try {
            /* as long as the flag is raised we keep rebuilding, i.e. during the
             * last build another file changed and thus another rebuild is
             * needed */
            while (queue.length > 0) {
                const modifiedFiles = queue;
                queue = [];
                const generatedFiles = await callback(modifiedFiles);
                livereload(generatedFiles);

                /* delay further execution for a while so the live reload can finish before the new files are rebuilt */
                await sleep(200);
            }
        } finally {
            /* clear the flag so the next request can run a rebuild normally */
            inflight = false;
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-misused-promises -- technical debt */
    return rebuild;
}

function isImportError(err: unknown): err is Error & { code: string } {
    return Boolean(err && typeof err === "object" && "code" in err);
}

/* eslint-disable-next-line @typescript-eslint/consistent-type-imports -- technical debt */
async function importExpress(): Promise<typeof import("express")> {
    try {
        const { default: express } = await import("express");
        return express;
    } catch (err: unknown) {
        if (isImportError(err) && err.code === "ERR_MODULE_NOT_FOUND") {
            throw new Error(
                "docs-generator serve() requires the optional peerDependency express to be installed",
                { cause: err },
            );
        } else {
            throw err;
        }
    }
}

/**
 * @internal
 */
export async function serve(options: ServeOptions): Promise<void> {
    const express = await importExpress();
    const app = express();
    app.use(express.static(options.outputFolder));
    const server = app.listen(8080);
    printMenu(server.address() as AddressInfo);

    const livereload = tinylr();
    livereload.listen(35729);

    const watcher = watch(options.watch);
    const rebuild = createRebuilder(options.rebuild, (filePath: string[]) => {
        const files = filePath.map((it) => {
            return path.relative(options.outputFolder, it);
        });
        livereload.changed({ body: { files } });
    });

    watcher.on("change", (filePath: string) => {
        rebuild(filePath);
    });

    for (;;) {
        const key = await keypress();
        switch (key) {
            case "\x03": /* ctrl-c */
            case "q":
                /* eslint-disable-next-line no-console -- expected to log */
                console.log("Shutting down gracefully");
                server.close();
                /* eslint-disable-next-line @typescript-eslint/no-floating-promises -- technical debt */
                watcher.close();
                livereload.close();
                process.stdin.unref();
                return;
        }
    }
}
