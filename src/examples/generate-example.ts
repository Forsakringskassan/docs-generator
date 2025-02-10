import fs from "node:fs";
import { version } from "vue";
import { generateCode as vue3 } from "plugin-vue3";
import { getFingerprint, parseImport } from "../utils";
import { type ExampleOptions } from "./example-options";
import { type ExampleResult } from "./example-result";
import { getExampleImport } from "./get-example-import";
import { getExampleName } from "./get-example-name";

const vueMajor = parseInt(version.split(".", 2)[0], 10) as 2 | 3;

function vueGenerator(): typeof vue3 {
    switch (vueMajor) {
        case 2:
            throw new Error(
                "Vue 2 is no longer supported, upgrade to Vue 3 or downgrade docs-generator",
            );
        case 3:
            return vue3;
    }
}

/**
 * @internal
 */
export function generateExample(options: ExampleOptions): ExampleResult {
    const { language } = options;

    if (language === "import") {
        const parsed = parseImport(options.source);
        const filename = getExampleImport(
            options.exampleFolders,
            parsed.filename,
        );
        const language = parsed.extension;
        const comments = parsed.comments;
        const content = fs.readFileSync(filename, "utf-8");
        const example = generateExample({
            ...options,
            source: content,
            language,
            filename,
        });
        return { ...example, comments };
    }

    switch (language) {
        case "vue":
            return generateVueExample(options);
        case "html":
            return generateStaticExample(options);
        default:
            return generateStaticExample(options);
    }
}

function generateVueExample(options: ExampleOptions): ExampleResult {
    const { filename, source, parent, setupPath, tags } = options;
    const fn = vueGenerator();
    const slug = getExampleName(filename);
    const fingerprint = getFingerprint(source);
    const { markup, sourcecode, output } = fn({
        filename,
        slug,
        fingerprint,
        code: source,
        setupPath,
    });
    if (output) {
        return {
            source,
            language: options.language,
            comments: [],
            tags,
            markup,
            output,
            runtime: true,
            task: {
                outputFile: output,
                sourcecode,
                sourceFile: filename,
                parent,
            },
        };
    } else {
        return {
            source: sourcecode,
            language: "plaintext",
            comments: [],
            tags,
            markup,
            output: null,
            runtime: true,
            task: null,
        };
    }
}

function generateStaticExample(options: ExampleOptions): ExampleResult {
    const { filename, source, language, tags } = options;
    const slug = getExampleName(filename);
    const fingerprint = getFingerprint(source);
    const asset = `${slug}-${fingerprint}.${language}`;
    const runtimeLanguages = ["html"];
    const runtime = runtimeLanguages.includes(language);
    return {
        source,
        language: options.language,
        comments: [],
        tags,
        markup: source,
        output: runtime ? asset : null,
        runtime,
        task: null,
    };
}
