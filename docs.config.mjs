import {
    frontMatterFileReader,
    navigationFileReader,
    vueFileReader,
} from "./dist/index.mjs";

/**
 * @param {string} name - Prefixed name of css variable.
 * @param {{description: string, value: string, type?: string }} entry
 * @returns {string}
 */
function renderVariable(name, entry) {
    switch (entry.type) {
        case "color":
            return `<code class="preview-color" style="--current-value: var(${name})">${entry.value}</code>`;
        case "font":
            return `\`${entry.value}\``;
        default:
            return `\`${entry.value}\``;
    }
}

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
                const prefixedName = `${prefix}${variable}`;
                return `| \`${prefixedName}\` | ${renderVariable(
                    prefixedName,
                    it,
                )} | ${it.description ?? "-"} |`;
            }),
        ].join("\n");
        return [heading, description, table].join("\n\n");
    });
    const doc = {
        kind: "partial",
        id: `fs:${filePath.replace(/\\/g, "/")}`,
        name: `css-variables:${filePath.replace(/\\/g, "/")}`,
        alias: [],
        body: groups.join("\n\n"),
        format: "markdown",
        tags: [],
        fileInfo: {
            fullPath: null,
        },
    };
    return [doc];
}

export default {
    sourceFiles: [
        {
            include: "docs/**/*.md",
            exclude: ["docs/node_modules/**", "docs/examples/**"],
            basePath: "./docs/",
            fileReader: frontMatterFileReader,
        },
        {
            include: "docs/*/**/*.json",
            exclude: [
                "docs/src/**",
                "docs/node_modules/**",
                "docs/examples/**",
            ],
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
                doc.body = doc.body.replace(/^# .*$/m, "");
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
        {
            include: "docs/markdown/api/vue/*.vue",
            fileReader: vueFileReader("tsconfig.json"),
        },
    ],
};
