import path from "node:path";
import {
    Generator,
    frontMatterFileReader,
} from "@forsakringskassan/docs-generator";

const base = path.basename(import.meta.dirname);
const outputFolder = path.join("../../public/integration-tests", base);

const docs = new Generator(import.meta.url, {
    site: {
        name: "Integration test: tabs",
        lang: "en",
    },
    outputFolder,
    templateFolders: ["./docs/templates"],
    sourceFiles: [
        {
            include: "docs/**/*.md",
            basePath: "./docs/",
            fileReader: frontMatterFileReader,
        },
    ],
});

docs.compileStyle("main", "./docs/src/main.scss", {
    appendTo: "head",
});

await docs.build();
