import {
    Generator,
    frontMatterFileReader,
} from "@forsakringskassan/docs-generator";

const docs = new Generator(import.meta.url, {
    site: {
        name: "Integration test: relative import",
        lang: "en",
    },
    outputFolder: "./public",
    exampleFolders: ["./docs"],
    sourceFiles: [
        {
            include: "docs/**/*.md",
            basePath: "./docs/",
            fileReader: frontMatterFileReader,
        },
    ],
});

await docs.build();
