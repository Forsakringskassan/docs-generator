import {
    Generator,
    extractMarkdownProcessor,
    frontMatterFileReader,
    manifestProcessor,
    vueFileReader,
} from "@forsakringskassan/docs-generator";

const docs = new Generator(import.meta.url, {
    site: {
        name: "Integration test: base",
        lang: "en",
    },
    outputFolder: "./public",
    exampleFolders: ["./src"],
    processors: [
        extractMarkdownProcessor({
            outputFolder: "dist",
        }),
        manifestProcessor(),
    ],
});

await docs.build([
    {
        include: "docs/**/*.md",
        basePath: "./docs/",
        fileReader: frontMatterFileReader,
    },
    {
        include: ["src/**/*.vue"],
        fileReader: vueFileReader,
    },
]);
