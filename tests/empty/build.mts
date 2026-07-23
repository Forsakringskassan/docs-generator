import path from "node:path";
import { Generator } from "@forsakringskassan/docs-generator";

const base = path.basename(import.meta.dirname);
const outputFolder = path.join("../../public/integration-tests", base);

const docs = new Generator(import.meta.url, {
    site: {
        name: "Integration test: empty",
        lang: "en",
    },
    outputFolder,
});

await docs.build([]);
