import fs from "node:fs/promises";
import path from "node:path/posix";
import { type Processor } from "../processor";
import { type ResourceTask } from "./resource-task";

/**
 * @internal
 */
export function staticResourcesProcessor(
    assetFolder: string,
    resources: ResourceTask[],
): Processor {
    return {
        name: "static-resources-processor",
        after: "render",
        async handler(context) {
            for (const resource of [...resources, ...context.resources]) {
                const src = resource.from;
                const dst = path.join(assetFolder, resource.to);
                await fs.cp(src, dst, {
                    recursive: true,
                });
                context.log(src, "->", dst);
            }
        },
    };
}
