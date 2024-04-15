import { compileTemplate, parse } from "vue/compiler-sfc";

export interface ExampleOptions {
    /* original filename */
    filename: string;
    /* example slug */
    slug: string;
    /* example fingerprint (hash of the sourcecode) */
    fingerprint: string;
    /** example sourcecode */
    code: string;
    /** absolute path to setup function */
    setupPath: string;
}

export interface ExampleResult {
    /* HTML markup to inject into the document */
    markup: string;
    /* JS sourcecode to compile */
    sourcecode: string;
    /* asset filename */
    output: string;
}

export function generateCode(options: ExampleOptions): ExampleResult {
    const { slug, fingerprint, code, filename, setupPath } = options;
    const selector = `#${slug}`;
    const asset = `${slug}-${fingerprint}.js`;
    const { descriptor, errors } = parse(code, { filename });

    if (errors.length) {
        throw new Error(`Errors occured when trying to parse ${filename}.`);
    }

    /** TODO: Re-examine if needed, when migrated to Vue 3 (SFKUI-5718)*/
    if (descriptor.template?.content) {
        descriptor.template.content = descriptor.template.content.replace(
            "\\\\",
            "\\",
        );
    }

    if (descriptor.styles.some((it) => it.scoped)) {
        throw new Error(
            `Scoped style in ${filename}. Scoped styles are not implemented.`,
        );
    }

    const styleContent = descriptor.styles
        .map((stylePart) => stylePart.content)
        .join("\n");

    let sourcecode = `import { setup } from "${setupPath}";\n`;

    if (descriptor.script?.content) {
        sourcecode += descriptor.script.content.replace(
            "export default",
            "const exampleComponent = ",
        );
    }

    if (descriptor.template) {
        const js = compileTemplate({
            id: filename,
            filename,
            source: descriptor.template.content,
            preprocessLang: descriptor.template.lang,
            compilerOptions: {
                comments: false,
                whitespace: "preserve",
            },
        });

        sourcecode += `${js.code}\n\n`;
        sourcecode += `exampleComponent.render = render;\n\n`;
    }

    sourcecode += `setup({\n  rootComponent: exampleComponent,\n  selector: "${selector}"\n});\n`;

    const markup = /* HTML */ `
        <div id="${slug}"></div>
        <!-- [html-validate-disable-next element-permitted-content -- technical debt, should be inserted into <head>] -->
        <style>
            ${styleContent}
        </style>
        <!-- [html-validate-disable-next require-sri -- technical debt, should generate integrity but we don't know the hash of the compiled file yet] -->
        <script defer src="./${asset}"></script>
    `;

    return {
        markup,
        sourcecode,
        output: asset,
    };
}
