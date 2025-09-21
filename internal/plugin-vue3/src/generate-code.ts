import crypto from "node:crypto";
import isCI from "is-ci";
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
    output: string | false;
}

const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
const HTML_REPLACEMENTS: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
};

/**
 * technical debt: we have a copy in utils but from here we cannot import utils,
 * this should be moved back into the core src folder and then use the same
 * function
 */
function escapeHtml(str: string): string {
    return str.replace(HTML_ESCAPE_REPLACE_RE, (ch) => HTML_REPLACEMENTS[ch]);
}

let counter = 1;

export function getUniqueId(slug: string, fingerprint: string): string {
    /* eslint-disable-next-line sonarjs/hashing -- technical debt, not used in a sensitive context but could still be replaced */
    return crypto
        .createHash("md5")
        .update(slug)
        .update(fingerprint)
        .update(String(counter++))
        .digest("hex")
        .slice(0, 6);
}

export function generateCode(options: ExampleOptions): ExampleResult {
    const { slug, fingerprint, code, filename, setupPath } = options;
    const id = getUniqueId(slug, fingerprint);
    const exampleId = `example-${id}`;
    const selector = `#${exampleId}`;
    const asset = `${slug}-${id}.js`;
    const { descriptor, errors } = parse(code, { filename });
    const scopeId = `data-v-${id}`;

    if (errors.length > 0) {
        if (isCI) {
            const first = errors[0].message;
            throw new Error(
                `Errors occurred when trying to parse "${filename}": ${first}`,
            );
        }
        const lines = errors.map((it) => `  ${it.message}`);
        const escaped = lines.map(escapeHtml);
        return {
            markup: `<strong style="color: red">Vue compiler error</strong>:<br><pre>${escaped.join("\n")}</pre>`,
            sourcecode: `Vue compiler error:\n${lines.join("\n")}`,
            output: false,
        };
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
        <div id="${exampleId}"></div>
        <!-- [html-validate-disable-next element-permitted-content -- technical debt, should be inserted into <head>] -->
        <style>
            ${styleContent}
        </style>
        <!-- [html-validate-disable-next require-sri -- technical debt, should generate integrity but we don't know the hash of the compiled file yet] -->
        <script type="module" src="./${asset}"></script>
    `;

    return {
        markup,
        sourcecode,
        output: asset,
    };
}
