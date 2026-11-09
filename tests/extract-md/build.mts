import {
    Generator,
    extractMarkdownProcessor,
    frontMatterFileReader,
    manifestProcessor,
    vueFileReader,
} from "@forsakringskassan/docs-generator";

declare module "@forsakringskassan/docs-generator" {
    interface ExtractedDocsMetadata {
        revision: string;
    }
}

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
            metadata() {
                return Promise.resolve({ revision: "foobar" });
            },
        }),
        manifestProcessor(),
    ],
    sourceFiles: [
        {
            include: "docs/**/*.md",
            basePath: "./docs/",
            fileReader: frontMatterFileReader,
        },
        {
            include: ["src/**/*.vue"],
            fileReader: vueFileReader,
        },
    ],
});

await docs.build();
