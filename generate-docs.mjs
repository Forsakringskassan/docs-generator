import fs from "node:fs/promises";
import path from "node:path";
import {
    Generator,
    manifestProcessor,
    versionProcessor,
    searchProcessor,
    sourceUrlProcessor,
} from "./dist/index.js";
import config from "./docs.config.mjs";

const isRelease = Boolean(process.env.RELEASE);
const pkg = JSON.parse(await fs.readFile("./package.json", "utf-8"));

const docs = new Generator({
    site: {
        name: "FK Documentation generator",
        lang: "sv",
    },
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
        manifestProcessor({ markdown: "etc/docs-manifest.md" }),
        searchProcessor(),
        versionProcessor(pkg, "toolbar", {
            scm: !isRelease
                ? {
                      commitUrlFormat: "{{ homepage }}/commit/{{ hash }}",
                      prUrlFormat: "{{ homepage }}/pull-requests/{{ id }}",
                  }
                : undefined,
        }),
        sourceUrlProcessor({
            urlFormat:
                "https://github.com/Forsakringskassan/docs-generator/tree/main/{{path}}",
            componentFileExtension: "baz",
        }),
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
