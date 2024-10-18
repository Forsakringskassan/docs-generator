import {
    type BindingMetadata,
    compileScript,
    compileStyle,
    compileTemplate,
    parse,
} from "vue/compiler-sfc";

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
    const scopeId = `data-v-${fingerprint}`;

    if (errors.length) {
        throw new Error(`Errors occured when trying to parse ${filename}.`);
    }

    const hasScoped = descriptor.styles.some((e) => e.scoped);
    const styleContent = descriptor.styles
        .map((stylePart) => {
            const compiledStyle = compileStyle({
                filename: descriptor.filename,
                source: stylePart.content,
                isProd: false,
                id: scopeId,
                scoped: stylePart.scoped,
                trim: true,
            });
            return compiledStyle.code;
        })
        .join("\n");

    let sourcecode = `import { setup } from "${setupPath}";\n`;

    let bindings: BindingMetadata | undefined = undefined;
    if (descriptor.script || descriptor.scriptSetup) {
        const script = compileScript(descriptor, {
            id: scopeId,
            isProd: false,
            sourceMap: false,
            inlineTemplate: false,
            genDefaultAs: "exampleComponent",
            templateOptions: {
                id: scopeId,
                filename,
                source: descriptor.template?.content,
                scoped: hasScoped,
                slotted: descriptor.slotted,
                compilerOptions: {
                    comments: false,
                    whitespace: "condense",
                    scopeId: hasScoped ? scopeId : undefined,
                    mode: "module",
                },
            },
        });
        bindings = script.bindings;
        sourcecode += script.content;
        sourcecode += "\n\n";
    } else {
        /* edge case: handle when the vue component does not have <script> but only a <template> */
        sourcecode += `const exampleComponent = {};\n\n`;
    }

    if (descriptor.template) {
        const template = compileTemplate({
            id: scopeId,
            filename,
            source: descriptor.template.content,
            scoped: hasScoped,
            slotted: descriptor.slotted,
            preprocessLang: descriptor.template.lang,
            compilerOptions: {
                bindingMetadata: bindings,
                comments: false,
                whitespace: "condense",
                scopeId: hasScoped ? scopeId : undefined,
                mode: "module",
            },
        });
        sourcecode += `${template.code}\n\n`;
        sourcecode += `exampleComponent.render = render;\n`;
    }

    if (hasScoped) {
        sourcecode += `exampleComponent.__scopeId = "${scopeId}";\n`;
    }

    sourcecode += `\nsetup({\n  rootComponent: exampleComponent,\n  selector: "${selector}"\n});\n`;

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
