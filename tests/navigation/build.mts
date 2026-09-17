import fs from "node:fs/promises";
import path from "node:path";
import {
    Generator,
    frontMatterFileReader,
} from "@forsakringskassan/docs-generator";

import pkg from "./package.json" with { type: "json" };

const base = path.basename(import.meta.dirname);
const outputFolder = path.join("../../public/integration-tests", base);

const docs = new Generator(import.meta.url, {
    site: {
        name: "Integration test: navigation",
        lang: "en",
    },
    outputFolder,
    templateFolders: ["./docs/templates"],
    processors: [
        {
            name: "awesome-widget",
            before: "render",
            handler(context) {
                context.addTemplateBlock("toolbar", "awesome-widget", {
                    filename: "partials/awesome-widget.html",
                });
            },
        },
    ],
});

docs.compileStyle("main", "./docs/src/main.scss", {
    appendTo: "head",
});

await docs.build([
    {
        include: "docs/**/*.md",
        basePath: "./docs/",
        fileReader: frontMatterFileReader,
    },
]);
const latest = `v${pkg.version}`;
const versions = JSON.stringify({ latest, versions: [latest] }, null, 2);
await fs.writeFile(path.join(outputFolder, "versions.json"), versions, "utf8");
