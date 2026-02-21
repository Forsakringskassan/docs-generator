import fs from "node:fs/promises";
import path from "node:path";
import { assets as fontAssets } from "@fkui/font-default/metadata";
import isCI from "is-ci";
import {
    Generator,
    cookieProcessor,
    extractExamplesProcessor,
    htmlRedirectProcessor,
    isRelease,
    manifestProcessor,
    motdProcessor,
    redirectFileProcessor,
    searchProcessor,
    selectableVersionProcessor,
    sourceUrlProcessor,
    versionProcessor,
} from "./dist/index.mjs";
import config from "./docs.config.mjs";

const pkg = JSON.parse(await fs.readFile("./package.json", "utf-8"));

const docs = new Generator(import.meta.url, {
    site: {
        name: "FK Documentation generator",
        lang: "en",
    },
    bundleDefaultFont: false,
    outputFolder: "./public",
    cacheFolder: "./temp/docs",
    exampleFolders: ["./docs", "./src"],
    templateFolders: ["./docs/templates"],
    vendor: [
        {
            package: "vue",
            expose: "named",
            alias: "vue/dist/vue.esm-bundler.js",
        },
        "@forsakringskassan/docs-live-example",
    ],
    processors: [
        extractExamplesProcessor({
            outputFolder: "docs/examples/files",
        }),
        htmlRedirectProcessor(),
        redirectFileProcessor(),
        manifestProcessor({
            markdown: "etc/docs-manifest.md",
            verify: isCI,
        }),
        searchProcessor(),
        versionProcessor(pkg, "toolbar", {
            scm: !isRelease()
                ? {
                      commitUrlFormat: "{{ repository }}/commits/{{ hash }}",
                      prUrlFormat: "{{ repository }}/pull/{{ pr }}",
                  }
                : undefined,
        }),
        sourceUrlProcessor(pkg, {
            sourceFiles: ["docs/**"],
            urlFormat: "{{ repository }}/tree/main/{{ path }}",
            componentFileExtension: "baz",
        }),
        cookieProcessor(),
        motdProcessor(),
        selectableVersionProcessor(pkg, "footer"),
    ],
    setupPath: path.resolve("docs/src/setup.ts"),
});

docs.compileScript("main", "./docs/src/main.js", {
    appendTo: "body",
});

docs.compileStyle("docs", "./docs/src/docs-theme.scss", {
    appendTo: "head",
});

docs.compileStyle("fkui", "./docs/src/fkui.css", {
    appendTo: "head",
});

try {
    await docs.build(config.sourceFiles);
} catch (err) {
    console.error(err.prettyError ? err.prettyError() : err);
    process.exitCode = 1;
}

await fs.mkdir("public/assets/fonts", { recursive: true });
for (const asset of fontAssets) {
    await fs.copyFile(
        asset.filePath,
        path.join("public/assets", asset.filename),
    );
}

if (!isCI) {
    const latest = `v${pkg.version}`;
    const versions = JSON.stringify(
        {
            latest,
            versions: [latest],
        },
        null,
        2,
    );
    await fs.writeFile("public/versions.json", versions, "utf-8");
}
