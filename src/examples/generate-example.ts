import fs from "node:fs";
import { version } from "vue";
import { generateCode as vue2 } from "plugin-vue2";
import { generateCode as vue3 } from "plugin-vue3";
import { getFingerprint, parseImport } from "../utils";
import { type ExampleOptions } from "./example-options";
import { type ExampleResult } from "./example-result";
import { getExampleImport } from "./get-example-import";
import { getExampleName } from "./get-example-name";

const vueMajor = parseInt(version.split(".", 2)[0], 10) as 2 | 3;
const vueGenerator = {
    [2]: vue2,
    [3]: vue3,
} as const;

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
        const source = fs.readFileSync(filename, "utf-8");
        const language = parsed.extension;
        const comments = parsed.comments;
        const example = generateExample({
            ...options,
            source,
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
    const fn = vueGenerator[vueMajor];
    const slug = getExampleName(filename);
    const fingerprint = getFingerprint(source);
    const { markup, sourcecode, output } = fn({
        filename,
        slug,
        fingerprint,
        code: source,
        setupPath,
    });
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
}

function generateStaticExample(options: ExampleOptions): ExampleResult {
    const { source, language, tags } = options;
    const runtimeLanguages = ["html"];
    return {
        source,
        language: options.language,
        comments: [],
        tags,
        markup: source,
        output: null,
        runtime: runtimeLanguages.includes(language),
    };
}
