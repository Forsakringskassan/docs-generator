import path from "node:path";
import module from "node:module";
import {
    frontMatterFileReader,
    Generator,
    navigationFileReader,
    versionProcessor,
    searchProcessor,
    /* eslint-disable-next-line import/extensions -- must use extension for esm */
} from "./dist/generator.js";

const require = module.createRequire(import.meta.url);

const pkg = require("./package.json");

async function cssVariablesFileReader(filePath) {
    const { default: module } = await import(`./${filePath}`);
    const capitalize = (value) => `${value[0].toUpperCase()}${value.slice(1)}`;
    const groups = Object.entries(module).map(([key, entry]) => {
        const name = key === "*" ? "Global" : `${capitalize(key)}`;
        const prefix = key === "*" ? "--docs-" : `--docs-${key}-`;
        const heading = `## ${name}`;
        const description = entry.description;
        const table = [
            `| Variable | Default value | Description |`,
            `|----------|---------------|-------------|`,
            ...Object.entries(entry.variables).map(([variable, it]) => {
                return `| \`${prefix}${variable}\` | \`${it.value}\` | ${it.description ?? "-"} |`;
            }),
        ].join("\n");
        return [heading, description, table].join("\n\n");
    });
    const doc = {
        id: `fs:${filePath.replace(/\\/g, "/")}`,
        name: `css-variables:${filePath}`,
        alias: [],
        visible: false,
        attributes: { sortorder: Infinity },
        body: groups.join("\n\n"),
        outline: [],
        format: "markdown",
        tags: [],
        template: "",
        fileInfo: {
            path: "",
            name: "",
            fullPath: "",
            outputName: false,
        },
    };
    return [doc];
}

const docs = new Generator({
    site: {
        name: "FK Documentation generator",
        lang: "sv",
    },
    outputFolder: "./public",
    cacheFolder: "./temp/docs",
    exampleFolders: ["./docs"],
    templateFolders: ["./docs/templates"],
    vendor: [
        {
            package: "vue",
            expose: "named",
            alias: "vue/dist/vue.esm-bundler.js",
        },
        "@forsakringskassan/docs-live-example",
    ],
    processors: [searchProcessor(), versionProcessor(pkg, "toolbar")],
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
    await docs.build([
        {
            include: "docs/**/*.md",
            basePath: "./docs/",
            fileReader: frontMatterFileReader,
        },
        {
            include: "docs/*/**/*.json",
            exclude: "docs/src/**",
            basePath: "./docs/",
            fileReader: navigationFileReader,
        },
        {
            include: "README.md",
            basePath: "./",
            fileReader: frontMatterFileReader,
        },
        {
            include: [
                "node_modules/@forsakringskassan/docs-live-example/README.md",
            ],
            basePath: "./node_modules/@forsakringskassan/docs-live-example",
            fileReader: frontMatterFileReader,
            transform(doc) {
                doc.template = "content-with-menu";
                doc.name = "Live example";
                doc.attributes.title = "Live example";
                doc.attributes.sortorder = 1;
                doc.fileInfo.path = "./live-example";
                return doc;
            },
        },
        {
            include: "CHANGELOG.md",
            basePath: "./",
            fileReader: frontMatterFileReader,
            transform(doc) {
                doc.name = "changelog";
                doc.attributes.title = "Changelog";
                doc.body = doc.body.replace(/^# CHANGELOG$/m, "");
                return doc;
            },
        },
        {
            include: "src/style/css-variables.mjs",
            basePath: "./src/style",
            fileReader: cssVariablesFileReader,
        },
    ]);
} catch (err) {
    console.error(err.prettyError ? err.prettyError() : err);
    process.exitCode = 1;
}
