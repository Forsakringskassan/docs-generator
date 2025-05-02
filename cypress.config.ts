import { defineConfig } from "cypress";
import htmlvalidate from "cypress-html-validate/plugin";
import { type Manifest, Generator } from "./dist";

/* eslint-disable-next-line import/extensions -- extension is needed in this case */
import config from "./docs.config.mjs";

async function getDocsPages(): Promise<Manifest["pages"]> {
    const docs = new Generator(import.meta.url, {
        site: {
            name: "FK Documentation generator",
            lang: "en",
        },
        setupPath: "",
    });
    const manifest = await docs.manifest(config.sourceFiles);
    return manifest.pages.filter((it) => {
        return it.path.endsWith(".html");
    });
}

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:8080",
        async setupNodeEvents(on, config) {
            config.env.pages = await getDocsPages();

            htmlvalidate.install(on);

            return config;
        },
    },
});
