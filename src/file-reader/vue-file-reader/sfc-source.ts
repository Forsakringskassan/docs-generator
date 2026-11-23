import ts from "typescript";
import {
    type SFCBlock,
    type SFCDescriptor,
    parse as parseSFC,
} from "vue/compiler-sfc";
import {
    type DocComment,
    type DocTag,
    type NamedTag,
    parseDocComment,
    parseNamedTag,
} from "./parse-jsdoc";

/* Node type constants from `@vue/compiler-core` (`NodeTypes`), inlined to
 * avoid depending on a const enum across package boundaries. */
const ELEMENT_NODE = 1;
const COMMENT_NODE = 3;
const ATTRIBUTE_NODE = 6;

/* Template AST types derived from `vue/compiler-sfc` as `@vue/compiler-core`
 * is not a direct dependency */
type RootNode = NonNullable<NonNullable<SFCDescriptor["template"]>["ast"]>;
type TemplateChildNode = RootNode["children"][number];
type ElementNode = Extract<TemplateChildNode, { tag: string }>;
type CommentNode = TemplateChildNode & { content: string };

/**
 * Documentation for a single event collected from the component source.
 *
 * @internal
 */
export interface SourceEventDoc {
    readonly name: string;
    readonly description: string | null;
    readonly tags: DocTag[];
}

/**
 * Documentation for a single slot binding written as a `binding` tag
 * (`{type} name description`) in a template comment.
 *
 * @internal
 */
export type SourceSlotBindingDoc = NamedTag;

/**
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
}

interface ParsedScriptBlock {
    readonly sourceFile: ts.SourceFile;
    /** Offset of the block content within the full SFC source */
    readonly offset: number;
    readonly setup: boolean;
}

/**
 * Parsed view of a single SFC used to read what `vue-component-meta` does not
 * provide: doc comments on events, doc comments on template slots and the
 * declaration nodes behind props.
 *
 * @internal
 */
export interface SfcSource {
    /** Events in declaration order with their doc comments */
    readonly events: SourceEventDoc[];
    /** Template slots (with a doc comment) in template order */
    readonly slots: SourceSlotDoc[];
    /**
     * Find the declaration node starting at the given offset in the SFC
     * source, as reported by `vue-component-meta` `getDeclarations()`.
     */
    findNodeAt(start: number, end: number): ts.Node | undefined;
}

function scriptKindFromLang(lang: string | undefined): ts.ScriptKind {
    switch (lang) {
        case "ts":
            return ts.ScriptKind.TS;
        case "tsx":
            return ts.ScriptKind.TSX;
        case "jsx":
            return ts.ScriptKind.JSX;
        default:
            return ts.ScriptKind.JS;
    }
}

function parseScriptBlock(
    filePath: string,
    block: SFCBlock,
    setup: boolean,
): ParsedScriptBlock {
    const scriptKind = scriptKindFromLang(block.lang);
    const sourceFile = ts.createSourceFile(
        `${filePath}.${block.lang ?? "js"}`,
        block.content,
        ts.ScriptTarget.Latest,
        true,
        scriptKind,
    );
    return { sourceFile, offset: block.loc.start.offset, setup };
}

/**
 * Get the last `/** ... *\/` comment directly preceding the node, skipping
 * other comments such as `/* eslint-disable-next-line *\/` in between.
 */
function getLeadingDocComment(
    sourceFile: ts.SourceFile,
    node: ts.Node,
): DocComment | null {
    const commentRanges =
        ts.getLeadingCommentRanges(sourceFile.text, node.getFullStart()) ?? [];
    const docCommentRanges = commentRanges.filter((range) => {
        return sourceFile.text.startsWith("/**", range.pos);
    });
    const lastDocCommentRange = docCommentRanges.at(-1);
    if (!lastDocCommentRange) {
        return null;
    }
    const commentText = sourceFile.text.slice(
        lastDocCommentRange.pos,
        lastDocCommentRange.end,
    );
    return parseDocComment(commentText);
}

function getStaticPropertyName(name: ts.PropertyName): string | null {
    if (
        ts.isIdentifier(name) ||
        ts.isStringLiteral(name) ||
        ts.isNoSubstitutionTemplateLiteral(name) ||
        ts.isNumericLiteral(name)
    ) {
        return name.text;
    }
    return null;
}

function getStringLiteralValues(typeNode: ts.TypeNode | undefined): string[] {
    if (!typeNode) {
        return [];
    }
    if (
        ts.isLiteralTypeNode(typeNode) &&
        ts.isStringLiteral(typeNode.literal)
    ) {
        return [typeNode.literal.text];
    }
    if (ts.isUnionTypeNode(typeNode)) {
        return typeNode.types.flatMap((member) =>
            getStringLiteralValues(member),
        );
    }
    return [];
}

class EventDocCollector {
    private readonly eventsByName = new Map<string, SourceEventDoc>();

    public add(name: string, docComment: DocComment | null): void {
        const existingEvent = this.eventsByName.get(name);
        if (!existingEvent) {
            this.eventsByName.set(name, {
                name,
                description: docComment?.description ?? null,
                tags: docComment?.tags ?? [],
            });
            return;
        }
        /* an event can be documented both where it is declared and where it
         * is emitted, the first description found wins but tags are merged */
        this.eventsByName.set(name, {
            name,
            description:
                existingEvent.description ?? docComment?.description ?? null,
            tags: [...existingEvent.tags, ...(docComment?.tags ?? [])],
        });
    }

    public toArray(): SourceEventDoc[] {
        return Array.from(this.eventsByName.values());
    }
}

/**
 * Collect events from a runtime emits declaration, i.e. the array or object
 * passed to `emits:` or `defineEmits()`.
 */
function collectRuntimeEmits(
    sourceFile: ts.SourceFile,
    emitsDeclaration: ts.Expression,
    collector: EventDocCollector,
): void {
    if (ts.isArrayLiteralExpression(emitsDeclaration)) {
        for (const element of emitsDeclaration.elements) {
            if (!ts.isStringLiteralLike(element)) {
                continue;
            }
            collector.add(
                element.text,
                getLeadingDocComment(sourceFile, element),
            );
        }
        return;
    }
    if (ts.isObjectLiteralExpression(emitsDeclaration)) {
        for (const property of emitsDeclaration.properties) {
            const eventName = property.name
                ? getStaticPropertyName(property.name)
                : null;
            if (eventName === null) {
                continue;
            }
            collector.add(
                eventName,
                getLeadingDocComment(sourceFile, property),
            );
        }
    }
}

/**
 * Find a type literal, interface or type alias declared in the same file to
 * be able to read doc comments from `defineEmits<LocalType>()`.
 */
function resolveLocalTypeMembers(
    sourceFile: ts.SourceFile,
    emitsTypeNode: ts.TypeNode,
): readonly ts.TypeElement[] {
    let typeNode = emitsTypeNode;
    /* follow local type aliases: `type Emits = { ... }` */
    for (;;) {
        if (ts.isTypeLiteralNode(typeNode)) {
            return typeNode.members;
        }
        const localDeclaration = findLocalTypeDeclaration(sourceFile, typeNode);
        if (!localDeclaration) {
            return [];
        }
        if (ts.isInterfaceDeclaration(localDeclaration)) {
            return localDeclaration.members;
        }
        typeNode = localDeclaration.type;
    }
}

function findLocalTypeDeclaration(
    sourceFile: ts.SourceFile,
    typeNode: ts.TypeNode,
): ts.InterfaceDeclaration | ts.TypeAliasDeclaration | null {
    if (
        !ts.isTypeReferenceNode(typeNode) ||
        !ts.isIdentifier(typeNode.typeName)
    ) {
        return null;
    }
    const typeName = typeNode.typeName.text;
    for (const statement of sourceFile.statements) {
        const isTypeDeclaration =
            ts.isInterfaceDeclaration(statement) ||
            ts.isTypeAliasDeclaration(statement);
        if (isTypeDeclaration && statement.name.text === typeName) {
            return statement;
        }
    }
    return null;
}

function collectTypeEmits(
    sourceFile: ts.SourceFile,
    emitsType: ts.TypeNode,
    collector: EventDocCollector,
): void {
    const emitsMembers = resolveLocalTypeMembers(sourceFile, emitsType);
    for (const member of emitsMembers) {
        const docComment = getLeadingDocComment(sourceFile, member);
        /* (e: "foo", value: string): void */
        if (ts.isCallSignatureDeclaration(member)) {
            const eventNameType = member.parameters.at(0)?.type;
            const eventNames = getStringLiteralValues(eventNameType);
            for (const eventName of eventNames) {
                collector.add(eventName, docComment);
            }
            continue;
        }
        /* foo: [value: string] */
        if (!ts.isPropertySignature(member) && !ts.isMethodSignature(member)) {
            continue;
        }
        const eventName = getStaticPropertyName(member.name);
        if (eventName !== null) {
            collector.add(eventName, docComment);
        }
    }
}

/**
 * Returns the object literal passed to `export default` (optionally wrapped
 * in `defineComponent()`).
 */
function findOptionsObject(
    sourceFile: ts.SourceFile,
): ts.ObjectLiteralExpression | null {
    for (const statement of sourceFile.statements) {
        if (!ts.isExportAssignment(statement)) {
            continue;
        }
        let exported = statement.expression;
        if (ts.isCallExpression(exported) && exported.arguments.length > 0) {
            exported = exported.arguments[0];
        }
        if (ts.isObjectLiteralExpression(exported)) {
            return exported;
        }
    }
    return null;
}

function isThisEmitCall(callExpression: ts.CallExpression): boolean {
    const callee = callExpression.expression;
    return (
        ts.isPropertyAccessExpression(callee) &&
        callee.name.text === "$emit" &&
        callee.expression.kind === ts.SyntaxKind.ThisKeyword
    );
}

function isDefineEmitsCall(node: ts.Node): node is ts.CallExpression {
    return (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "defineEmits"
    );
}

/**
 * Collect events and their doc comments from all script blocks, in
 * declaration order.
 */
function collectEventDocs(scriptBlocks: ParsedScriptBlock[]): SourceEventDoc[] {
    const collector = new EventDocCollector();

    for (const { sourceFile, setup } of scriptBlocks) {
        if (!setup) {
            const emitsProperty = findOptionsObject(
                sourceFile,
            )?.properties.find(
                (property): property is ts.PropertyAssignment => {
                    return (
                        ts.isPropertyAssignment(property) &&
                        getStaticPropertyName(property.name) === "emits"
                    );
                },
            );
            if (emitsProperty) {
                collectRuntimeEmits(
                    sourceFile,
                    emitsProperty.initializer,
                    collector,
                );
            }
        }

        const emitFunctionNames = new Set<string>();
        const visit = (node: ts.Node): void => {
            if (setup && isDefineEmitsCall(node)) {
                const emitsType = node.typeArguments?.at(0);
                const emitsDeclaration = node.arguments.at(0);
                if (emitsType) {
                    collectTypeEmits(sourceFile, emitsType, collector);
                } else if (emitsDeclaration) {
                    collectRuntimeEmits(
                        sourceFile,
                        emitsDeclaration,
                        collector,
                    );
                }
                if (
                    ts.isVariableDeclaration(node.parent) &&
                    ts.isIdentifier(node.parent.name)
                ) {
                    emitFunctionNames.add(node.parent.name.text);
                }
            }
            /* `this.$emit("foo")` or `emit("foo")` with a doc comment on the
             * statement, as supported by vue-docgen-api */
            if (ts.isCallExpression(node)) {
                const isEmitCall =
                    isThisEmitCall(node) ||
                    (ts.isIdentifier(node.expression) &&
                        emitFunctionNames.has(node.expression.text));
                const eventNameArgument = node.arguments.at(0);
                if (
                    isEmitCall &&
                    eventNameArgument &&
                    ts.isStringLiteralLike(eventNameArgument)
                ) {
                    const statement = ts.isExpressionStatement(node.parent)
                        ? node.parent
                        : node;
                    collector.add(
                        eventNameArgument.text,
                        getLeadingDocComment(sourceFile, statement),
                    );
                }
            }
            ts.forEachChild(node, visit);
        };
        visit(sourceFile);
    }

    return collector.toArray();
}

function isElementNode(node: TemplateChildNode): node is ElementNode {
    const nodeType: number = node.type;
    return nodeType === ELEMENT_NODE && "tag" in node;
}

function isCommentNode(
    node: TemplateChildNode | undefined,
): node is CommentNode {
    if (!node) {
        return false;
    }
    const nodeType: number = node.type;
    return (
        nodeType === COMMENT_NODE &&
        "content" in node &&
        typeof node.content === "string"
    );
}

function getStaticSlotName(slotElement: ElementNode): string | null {
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

function parseSlotComment(
    name: string,
    commentText: string,
): SourceSlotDoc | null {
    const docComment = parseDocComment(commentText);
    const slotTag = docComment.tags.find((tag) => tag.name === "slot");
    if (!slotTag) {
        return null;
    }
    const bindings = docComment.tags
        .filter((tag) => tag.name === "binding")
        .map((tag) => parseNamedTag(tag.text))
        .filter((binding) => binding !== null);
    const description =
        slotTag.text === "" ? docComment.description : slotTag.text;
    return {
        name,
        description,
        tags: docComment.tags.filter(
            (tag) => tag.name !== "slot" && tag.name !== "binding",
        ),
        bindings,
    };
}

/**
 * Collect `@slot` doc comments placed directly before `<slot>` elements.
 */
function collectTemplateSlotDocs(
    templateAst: RootNode | undefined,
): SourceSlotDoc[] {
    const slotsByName = new Map<string, SourceSlotDoc>();
    const visitChildren = (children: TemplateChildNode[]): void => {
        for (const [index, child] of children.entries()) {
            if (!isElementNode(child)) {
                continue;
            }
            if (child.tag === "slot") {
                const slotName = getStaticSlotName(child);
                const precedingSibling = children[index - 1];
                const slotDoc =
                    slotName !== null && isCommentNode(precedingSibling)
                        ? parseSlotComment(slotName, precedingSibling.content)
                        : null;
                /* the same slot can be rendered in several branches, the first
                 * documented occurrence wins */
                if (slotDoc && !slotsByName.has(slotDoc.name)) {
                    slotsByName.set(slotDoc.name, slotDoc);
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

function findNodeInSourceFile(
    sourceFile: ts.SourceFile,
    start: number,
    end: number,
): ts.Node | undefined {
    let startMatch: ts.Node | undefined;
    const visit = (node: ts.Node): ts.Node | undefined => {
        const nodeStart = node.getStart(sourceFile);
        if (nodeStart === start && node.getEnd() === end) {
            return node;
        }
        if (nodeStart === start) {
            startMatch ??= node;
        }
        if (nodeStart <= start && node.getEnd() >= start) {
            return ts.forEachChild(node, visit);
        }
        return undefined;
    };
    return ts.forEachChild(sourceFile, visit) ?? startMatch;
}

/**
 * Parse an SFC into the pieces `vue-component-meta` does not cover.
 *
 * @internal
 */
export function parseSfcSource(filePath: string, source: string): SfcSource {
    const { descriptor } = parseSFC(source, { filename: filePath });
    const scriptBlocks = [
        descriptor.script
            ? parseScriptBlock(filePath, descriptor.script, false)
            : null,
        descriptor.scriptSetup
            ? parseScriptBlock(filePath, descriptor.scriptSetup, true)
            : null,
    ].filter((block) => block !== null);

    return {
        events: collectEventDocs(scriptBlocks),
        slots: collectTemplateSlotDocs(descriptor.template?.ast),
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
}

/**
 * Find the declaration node in a plain TypeScript file that is part of the
 * program (props declared in an imported interface).
 *
 * @internal
 */
export function findNodeInProgramFile(
    program: ts.Program | undefined,
    fileName: string,
    start: number,
    end: number,
): ts.Node | undefined {
    const sourceFile = program?.getSourceFile(fileName);
    if (!sourceFile) {
        return undefined;
    }
    return findNodeInSourceFile(sourceFile, start, end);
}
