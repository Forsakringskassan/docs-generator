import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { type Callback, type ILoaderAsync, type LoaderSource } from "nunjucks";
import { templateDirectory } from "./template-directory";

interface ResolvedTemplate {
    filePath: string;
    content: string;
}

/**
 * @internal
 */
export class TemplateLoader implements ILoaderAsync {
    public readonly async = true as const;
    private readonly folders: string[];
    private readonly templateCache: Map<string, ResolvedTemplate>;

    public constructor(folders: string[] = []) {
        this.folders = [...folders, templateDirectory];
        this.templateCache = new Map();
    }

    /* eslint-disable-next-line @typescript-eslint/no-misused-promises -- technical debt */
    public async getSource(
        name: string,
        callback: Callback<Error, LoaderSource>,
    ): Promise<void> {
        try {
            const { content, filePath } = await this.resolveTemplate(name);
            callback(null, {
                src: content,
                path: filePath,
                noCache: false,
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                callback(err, null);
            } else {
                callback(new Error(String(err)), null);
            }
        }
    }

    public hasTemplate(name: string): boolean {
        const { templateCache } = this;
        const cached = templateCache.get(name);
        if (cached) {
            return true;
        }
        const filePath = this.findTemplateFile(name);
        return Boolean(filePath);
    }

    private async resolveTemplate(name: string): Promise<ResolvedTemplate> {
        const { templateCache, folders } = this;
        const cached = templateCache.get(name);
        if (cached) {
            return cached;
        }
        const filePath = this.findTemplateFile(name);
        if (!filePath) {
            const searched = folders.map((it) => `  - "${it}"`).join("\n");
            const message = `Failed to resolve template "${name}", searched in:

${searched}

Make sure the name is correct and the template file exists in one of the listed directories.`;
            throw new Error(message);
        }
        const content = await fs.readFile(filePath, "utf-8");
        const resolved = { content, filePath };
        templateCache.set(name, resolved);
        return resolved;
    }

    private findTemplateFile(name: string): string | undefined {
        const { folders } = this;
        const searchPaths = folders.map((it) => path.join(it, name));
        return searchPaths.find((it) => existsSync(it));
    }
}
