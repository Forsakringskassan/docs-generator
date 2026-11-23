import sys

p = sys.argv[1]
s = open(p, encoding="utf8").read()


def rep(old, new):
    global s
    assert s.count(old) == 1, (old[:60], s.count(old))
    s = s.replace(old, new)


rep('''import ts from "typescript";
import {''', '''import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import {''')

rep('''/**
 * Documentation for a single slot written as an HTML comment directly
 * preceding the `<slot>` element in the template.
 *
 * @internal
 */
export interface SourceSlotDoc {
    readonly name: string;
    readonly description: string | null;
    readonly tags: DocTag[];
    readonly bindings: SourceSlotBindingDoc[];
}''', '''/**
 * A `<slot>` rendered in the template, with the documentation written as an
 * HTML comment preceding the `<slot>` element (if any).
 *
 * @internal
 */
export interface SourceSlotDoc {
    readonly name: string;
    readonly description: string | null;
    readonly tags: DocTag[];
    /** Bindings documented with `@binding` */
    readonly bindings: SourceSlotBindingDoc[];
    /** Names of bindings passed as attributes or `v-bind="{ ... }"` */
    readonly attributeBindings: string[];
}''')

rep('''export interface SfcSource {
    /** Events in declaration order with their doc comments */
    readonly events: SourceEventDoc[];
    /** Template slots (with a doc comment) in template order */
    readonly slots: SourceSlotDoc[];''', '''export interface SfcSource {
    /**
     * Events in declaration order with their doc comments, including events
     * inherited with `extends`.
     */
    readonly events: SourceEventDoc[];
    /**
     * All `<slot>` elements in the template in template order, inherited
     * from the component given by `extends` if the component has no
     * template of its own.
     */
    readonly slots: SourceSlotDoc[];
    /**
     * Default values given to `withDefaults()` as written, keyed by prop
     * name. `vue-component-meta` unwraps `() => value`, which is wrong for
     * props of function type.
     */
    readonly withDefaults: ReadonlyMap<string, string>;''')

start = s.index('''function getStaticSlotName(slotElement: ElementNode): string | null {''')
end = s.index('''function findNodeInSourceFile(''')
s = s[:start] + r'''function getStaticSlotName(slotElement: ElementNode): string | null {
    for (const prop of slotElement.props) {
        const propType: number = prop.type;
        if (propType === ATTRIBUTE_NODE && "value" in prop) {
            if (prop.name === "name") {
                return prop.value?.content ?? "default";
            }
            continue;
        }
        if (prop.name !== "bind" || !("arg" in prop)) {
            continue;
        }
        const bindArgument = prop.arg;
        if (
            bindArgument &&
            "content" in bindArgument &&
            bindArgument.content === "name"
        ) {
            /* dynamic slot name, cannot be documented statically */
            return null;
        }
    }
    return "default";
}

/**
 * Keys of an object literal expression such as `{ item, index: i }` as
 * used in `v-bind="{ ... }"`.
 */
function getObjectLiteralKeys(expressionText: string): string[] {
    const sourceFile = ts.createSourceFile(
        "v-bind.ts",
        `(${expressionText});`,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
    );
    const [statement] = sourceFile.statements;
    if (!ts.isExpressionStatement(statement)) {
        return [];
    }
    let expression = statement.expression;
    while (ts.isParenthesizedExpression(expression)) {
        expression = expression.expression;
    }
    if (!ts.isObjectLiteralExpression(expression)) {
        return [];
    }
    return expression.properties
        .map((property) => {
            return property.name ? getStaticPropertyName(property.name) : null;
        })
        .filter((name) => name !== null);
}

/**
 * Names of the slot props passed to a `<slot>` element: static attributes,
 * `:foo="bar"` (including the `:foo` shorthand) and `v-bind="{ foo }"`.
 */
function getAttributeBindings(slotElement: ElementNode): string[] {
    const bindingNames: string[] = [];
    for (const prop of slotElement.props) {
        if (prop.name === "name") {
            continue;
        }
        const propType: number = prop.type;
        if (propType === ATTRIBUTE_NODE) {
            bindingNames.push(prop.name);
            continue;
        }
        if (prop.name !== "bind" || !("arg" in prop)) {
            continue;
        }
        const bindArgument = prop.arg;
        if (bindArgument && "content" in bindArgument) {
            if (bindArgument.content !== "name") {
                bindingNames.push(bindArgument.content);
            }
            continue;
        }
        const bindExpression = prop.exp;
        if (bindExpression && "content" in bindExpression) {
            bindingNames.push(...getObjectLiteralKeys(bindExpression.content));
        }
    }
    return bindingNames;
}

/**
 * Find the `@slot` comment for a slot: the closest preceding sibling
 * comment containing `@slot`, skipping other comments in between (e.g.
 * linter directives) but stopping at any other node.
 */
function findSlotComment(
    siblings: TemplateChildNode[],
    slotIndex: number,
): CommentNode | null {
    for (let index = slotIndex - 1; index >= 0; index--) {
        const sibling = siblings[index];
        if (!isCommentNode(sibling)) {
            return null;
        }
        if (/@slot\b/.test(sibling.content)) {
            return sibling;
        }
    }
    return null;
}

function parseSlotElement(
    slotName: string,
    slotElement: ElementNode,
    slotComment: CommentNode | null,
): SourceSlotDoc {
    const attributeBindings = getAttributeBindings(slotElement);
    const docComment = slotComment
        ? parseDocComment(slotComment.content)
        : null;
    if (!docComment) {
        return {
            name: slotName,
            description: null,
            tags: [],
            bindings: [],
            attributeBindings,
        };
    }
    const slotTag = docComment.tags.find((tag) => tag.name === "slot");
    const bindings = docComment.tags
        .filter((tag) => tag.name === "binding")
        .map((tag) => parseNamedTag(tag.text))
        .filter((binding) => binding !== null);
    const slotTagText = slotTag?.text ?? "";
    return {
        name: slotName,
        description: slotTagText === "" ? docComment.description : slotTagText,
        tags: docComment.tags.filter(
            (tag) => tag.name !== "slot" && tag.name !== "binding",
        ),
        bindings,
        attributeBindings,
    };
}

/**
 * Collect all `<slot>` elements with their `@slot` doc comments.
 */
function collectTemplateSlots(
    templateAst: RootNode | undefined,
): SourceSlotDoc[] {
    const slotsByName = new Map<string, SourceSlotDoc>();
    const visitChildren = (children: TemplateChildNode[]): void => {
        for (const [index, child] of children.entries()) {
            if (!isElementNode(child)) {
                continue;
            }
            const slotName =
                child.tag === "slot" ? getStaticSlotName(child) : null;
            if (slotName !== null) {
                const slotDoc = parseSlotElement(
                    slotName,
                    child,
                    findSlotComment(children, index),
                );
                /* the same slot can be rendered in several branches, the
                 * first documented occurrence wins */
                const existingSlot = slotsByName.get(slotName);
                const replacesUndocumented =
                    existingSlot?.description === null &&
                    slotDoc.description !== null;
                if (!existingSlot || replacesUndocumented) {
                    slotsByName.set(slotName, slotDoc);
                }
            }
            visitChildren(child.children);
        }
    };
    if (templateAst) {
        visitChildren(templateAst.children);
    }
    return Array.from(slotsByName.values());
}

/**
 * Default values passed to `withDefaults()` exactly as written.
 */
function collectWithDefaults(
    scriptBlocks: ParsedScriptBlock[],
): Map<string, string> {
    const defaults = new Map<string, string>();
    for (const { sourceFile, setup } of scriptBlocks) {
        if (!setup) {
            continue;
        }
        const visit = (node: ts.Node): void => {
            const isWithDefaultsCall =
                ts.isCallExpression(node) &&
                ts.isIdentifier(node.expression) &&
                node.expression.text === "withDefaults";
            const defaultsArgument = isWithDefaultsCall
                ? node.arguments.at(1)
                : undefined;
            if (
                !defaultsArgument ||
                !ts.isObjectLiteralExpression(defaultsArgument)
            ) {
                ts.forEachChild(node, visit);
                return;
            }
            for (const property of defaultsArgument.properties) {
                const propName = property.name
                    ? getStaticPropertyName(property.name)
                    : null;
                if (propName === null) {
                    continue;
                }
                const defaultNode = ts.isPropertyAssignment(property)
                    ? property.initializer
                    : property;
                defaults.set(propName, defaultNode.getText(sourceFile));
            }
        };
        visit(sourceFile);
    }
    return defaults;
}

function findImportedVueFile(
    filePath: string,
    sourceFile: ts.SourceFile,
    importedName: string,
): string | null {
    for (const statement of sourceFile.statements) {
        if (
            !ts.isImportDeclaration(statement) ||
            !ts.isStringLiteral(statement.moduleSpecifier)
        ) {
            continue;
        }
        const defaultImportName = statement.importClause?.name?.text;
        const moduleName = statement.moduleSpecifier.text;
        const isRelativeVueImport =
            moduleName.startsWith(".") && moduleName.endsWith(".vue");
        if (defaultImportName === importedName && isRelativeVueImport) {
            return path.resolve(path.dirname(filePath), moduleName);
        }
    }
    return null;
}

/**
 * Resolve the SFC given to `extends` in the options API, e.g.
 * `extends: FTextField` with `import FTextField from "./FTextField.vue"`.
 * Only relative imports of `.vue` files are followed.
 */
function resolveExtendedComponent(
    filePath: string,
    scriptBlocks: ParsedScriptBlock[],
): string | null {
    for (const { sourceFile, setup } of scriptBlocks) {
        if (setup) {
            continue;
        }
        const optionsObject = findOptionsObject(sourceFile);
        const extendsProperty = optionsObject?.properties.find(
            (property): property is ts.PropertyAssignment => {
                return (
                    ts.isPropertyAssignment(property) &&
                    getStaticPropertyName(property.name) === "extends"
                );
            },
        );
        const extendsIdentifier = extendsProperty?.initializer;
        if (!extendsIdentifier || !ts.isIdentifier(extendsIdentifier)) {
            continue;
        }
        return findImportedVueFile(
            filePath,
            sourceFile,
            extendsIdentifier.text,
        );
    }
    return null;
}

function mergeInheritedEvents(
    inheritedEvents: SourceEventDoc[],
    ownEvents: SourceEventDoc[],
): SourceEventDoc[] {
    const ownEventNames = new Set(ownEvents.map((event) => event.name));
    const inheritedOnly = inheritedEvents.filter((event) => {
        return !ownEventNames.has(event.name);
    });
    return [...inheritedOnly, ...ownEvents];
}

''' + s[end:]

start = s.index('''/**
 * Parse an SFC into the pieces `vue-component-meta` does not cover.''')
end = s.index('''/**
 * Find the declaration node in a plain TypeScript file that is part of the''')
s = s[:start] + '''const sfcSourceCache = new Map<string, { source: string; sfc: SfcSource }>();

/**
 * Parse an SFC into the pieces `vue-component-meta` does not cover.
 *
 * @internal
 */
export function parseSfcSource(
    filePath: string,
    source: string,
    visitedFiles: ReadonlySet<string> = new Set(),
): SfcSource {
    const cacheKey = path.resolve(filePath);
    const cached = sfcSourceCache.get(cacheKey);
    if (cached?.source === source) {
        return cached.sfc;
    }

    const { descriptor } = parseSFC(source, { filename: filePath });
    const scriptBlocks = [
        descriptor.script
            ? parseScriptBlock(filePath, descriptor.script, false)
            : null,
        descriptor.scriptSetup
            ? parseScriptBlock(filePath, descriptor.scriptSetup, true)
            : null,
    ].filter((block) => block !== null);

    let events = collectEventDocs(scriptBlocks);
    let slots = collectTemplateSlots(descriptor.template?.ast);
    const extendedFile = resolveExtendedComponent(filePath, scriptBlocks);
    const canFollowExtends =
        extendedFile !== null &&
        !visitedFiles.has(extendedFile) &&
        fs.existsSync(extendedFile);
    if (extendedFile && canFollowExtends) {
        const extendedSfc = parseSfcSource(
            extendedFile,
            fs.readFileSync(extendedFile, "utf8"),
            new Set([...visitedFiles, cacheKey]),
        );
        events = mergeInheritedEvents(extendedSfc.events, events);
        /* the template is inherited only when the component has none */
        if (!descriptor.template) {
            slots = extendedSfc.slots;
        }
    }

    const sfc: SfcSource = {
        events,
        slots,
        withDefaults: collectWithDefaults(scriptBlocks),
        findNodeAt(start, end) {
            for (const { sourceFile, offset } of scriptBlocks) {
                const blockEnd = offset + sourceFile.text.length;
                if (start < offset || end > blockEnd) {
                    continue;
                }
                return findNodeInSourceFile(
                    sourceFile,
                    start - offset,
                    end - offset,
                );
            }
            return undefined;
        },
    };
    sfcSourceCache.set(cacheKey, { source, sfc });
    return sfc;
}

''' + s[end:]
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
