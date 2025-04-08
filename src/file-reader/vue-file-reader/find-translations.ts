import { parse as babelParser } from "@babel/parser";
import traverseModule, { type NodePath } from "@babel/traverse";
import {
    type CallExpression,
    type Comment,
    type CommentBlock,
    type MemberExpression,
    type Node,
    type ObjectExpression,
    type StringLiteral,
} from "@babel/types";
import {
    type BindingMetadata,
    compileScript,
    compileTemplate,
    parse,
} from "vue/compiler-sfc";
import isCI from "is-ci";
import { type TranslationKey } from "./translation-key";

type BabelTraverse = typeof traverseModule;
type TranslationParameter = TranslationKey["parameters"][number];

function isStringLiteral(node: Node): node is StringLiteral {
    return node.type === "StringLiteral";
}

function isObjectExpression(node: Node): node is ObjectExpression {
    return node.type === "ObjectExpression";
}

function isDocComment(node: Comment): node is CommentBlock {
    return node.type === "CommentBlock";
}

function getDescription(node: CommentBlock | null | undefined): string | null {
    if (!node) {
        return null;
    }
    const text = node.value;
    if (!text.startsWith("*")) {
        return null;
    }
    return node.value
        .replace(/^\s*[*]\s/gm, "") // removes leading whitespace and *
        .replace(/\s+$/gm, ""); // removes trailing whitespace
}

/**
 * Takes a member expression and converts it back to string:
 *
 * "foo.bar()"
 * "foo.bar.baz()"
 * "this.foo()"
 * ... etc
 *
 * If the expression contains anything dynamic `null` is returned.
 */
function flattenMemberExpression(node: MemberExpression): string | null {
    const { object, property } = node;
    if (property.type !== "Identifier") {
        return null;
    }
    if (object.type === "Identifier") {
        return [object.name, property.name].join(".");
    }
    if (object.type === "ThisExpression") {
        return ["this", property.name].join(".");
    }
    if (object.type === "MemberExpression") {
        const nested = flattenMemberExpression(object);
        if (nested) {
            return [nested, property.name].join(".");
        }
    }
    return null;
}

function getParameters(
    node: ObjectExpression | undefined,
): TranslationParameter[] {
    if (!node) {
        return [];
    }
    const parameters: TranslationParameter[] = [];
    for (const property of node.properties) {
        if (property.type !== "ObjectProperty") {
            continue;
        }
        if (property.key.type !== "Identifier") {
            continue;
        }
        const docComment = property.leadingComments?.find(isDocComment);
        parameters.push({
            name: property.key.name,
            description: getDescription(docComment),
        });
    }
    return parameters;
}

function isTranslateCall(node: CallExpression): boolean {
    const allowedNames = [
        "this.$t", // options api (inside computed, methods, etc)
        "_ctx.$t", // options api (template)
        "$setup.$t", // script setup or setup in options api
        "TranslationService.provider.translate", // props call this directly
    ];

    if (node.callee.type === "MemberExpression") {
        const fullName = flattenMemberExpression(node.callee);
        return Boolean(fullName && allowedNames.includes(fullName));
    }

    /* direct calls in script setup, i.e. from global scope */
    if (node.callee.type === "Identifier") {
        return node.callee.name === "$t";
    }

    return false;
}

function findDocComment(
    path: NodePath,
    node: CallExpression,
): CommentBlock | null {
    if (node.leadingComments) {
        const doc = node.leadingComments.find(isDocComment);
        if (doc) {
            return doc;
        }
    }

    const parent = path.parent;
    if (
        parent.leadingComments &&
        (parent.type === "ReturnStatement" || parent.type === "ObjectProperty")
    ) {
        const doc = parent.leadingComments.find(isDocComment);
        if (doc) {
            return doc;
        }
    }

    return null;
}

/**
 * Finds all translation keys from a Vue SFC.
 *
 * This works in three distinctive steps:
 *
 * 1. Parse the SFC to javascript sourcecode.
 * 2. Parse the javascript sourcecode to an AST.
 * 3. Traverse the AST looking for calls to `$t()` (or variants of it).
 *
 * @internal
 */
export function findTranslations(
    filename: string,
    content: string,
): TranslationKey[] {
    const { descriptor, errors } = parse(content, { filename });

    if (errors.length > 0) {
        if (isCI) {
            const first = errors[0].message;
            throw new Error(
                `Errors occurred when trying to parse "${filename}": ${first}`,
            );
        }
        return [];
    }

    const id = "faux-id";
    let sourcecode = "";

    let bindings: BindingMetadata | undefined = undefined;
    if (descriptor.script || descriptor.scriptSetup) {
        const script = compileScript(descriptor, {
            id,
            isProd: false,
            sourceMap: false,
            inlineTemplate: false,
            genDefaultAs: "exampleComponent",
            templateOptions: {
                filename,
                source: descriptor.template?.content,
                slotted: descriptor.slotted,
                compilerOptions: {
                    comments: true,
                    whitespace: "condense",
                    mode: "module",
                },
            },
        });
        bindings = script.bindings;
        sourcecode += `${script.content}\n\n`;
    }

    if (descriptor.template) {
        const template = compileTemplate({
            id,
            filename,
            source: descriptor.template.content,
            slotted: descriptor.slotted,
            preprocessLang: descriptor.template.lang,
            compilerOptions: {
                bindingMetadata: bindings,
                comments: true,
                whitespace: "condense",
                mode: "module",
            },
        });
        sourcecode += `${template.code}\n\n`;
    }

    const ast = babelParser(sourcecode, {
        sourceType: "module",
        plugins: ["typescript"],
    });

    /* hack as @babel/traverse doesnt play nicely with import */
    const traverse: BabelTraverse =
        "default" in traverseModule
            ? (traverseModule.default as BabelTraverse)
            : traverseModule;

    const result: TranslationKey[] = [];
    traverse(ast, {
        CallExpression(path) {
            const { node } = path;
            if (isTranslateCall(node)) {
                const [name, ...defaultOrParams] = node.arguments;
                const textArgument = defaultOrParams.find(isStringLiteral);
                const paramArgument = defaultOrParams.find(isObjectExpression);
                if (name.type !== "StringLiteral") {
                    return;
                }
                const defaultTranslation = textArgument
                    ? textArgument.value
                    : null;
                const docComment = findDocComment(path, node);
                result.push({
                    name: name.value,
                    defaultTranslation,
                    description: getDescription(docComment),
                    parameters: getParameters(paramArgument),
                });
            }
        },
    });

    return result;
}
