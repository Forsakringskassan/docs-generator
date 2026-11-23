import ts from "typescript";

const printer = ts.createPrinter({ removeComments: true });

const commentPattern = /\/\*|\/\//;

/**
 * Print a type node without comments on a single line, e.g.
 * `{ name: string }` instead of a multi-line type literal.
 *
 * The source text is used as-is (keeping the author's formatting) unless it
 * contains comments, e.g. doc comments on members of a type literal, in which
 * case the type is reprinted without them.
 */
function printTypeNode(
    typeNode: ts.TypeNode,
    sourceFile: ts.SourceFile,
): string {
    const isSynthesized = typeNode.pos < 0;
    const sourceText = isSynthesized ? null : typeNode.getText(sourceFile);
    if (sourceText !== null && !commentPattern.test(sourceText)) {
        return normalizeTypeText(sourceText);
    }
    const printedType = printer.printNode(
        ts.EmitHint.Unspecified,
        typeNode,
        sourceFile,
    );
    return normalizeTypeText(printedType);
}

/**
 * Print a method signature (`foo?(a: number): Bar`) as a function type
 * (`(a: number) => Bar`).
 */
function printMethodSignatureType(
    method: ts.MethodSignature,
    sourceFile: ts.SourceFile,
): string {
    const sourceText = method.getText(sourceFile);
    if (commentPattern.test(sourceText)) {
        const functionType = ts.factory.createFunctionTypeNode(
            method.typeParameters,
            method.parameters,
            method.type ??
                ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
        );
        return printTypeNode(functionType, sourceFile);
    }
    const typeParameters = method.typeParameters
        ? `<${method.typeParameters.map((it) => it.getText(sourceFile)).join(", ")}>`
        : "";
    const parameters = method.parameters
        .map((it) => it.getText(sourceFile))
        .join(", ");
    const returnType = method.type ? method.type.getText(sourceFile) : "void";
    return normalizeTypeText(
        `${typeParameters}(${parameters}) => ${returnType}`,
    );
}

/**
 * Collapse whitespace and drop the trailing `;` TypeScript prints in type
 * literals: `{\n    name: string;\n}` becomes `{ name: string }`.
 *
 * @internal
 */
export function normalizeTypeText(typeText: string): string {
    return typeText
        .replaceAll(/\s*\n\s*/g, " ")
        .replaceAll(/;\s*\}/g, " }")
        .replaceAll(/\{\s+\}/g, "{}")
        .trim();
}

/**
 * Remove parenthesis wrapping the entire type, `(A & B)` becomes `A & B` but
 * `(a: A) => (B)` is left as-is.
 */
function unwrapParenthesis(typeText: string): string {
    if (!typeText.startsWith("(") || !typeText.endsWith(")")) {
        return typeText;
    }
    let depth = 0;
    for (let index = 0; index < typeText.length; index++) {
        const char = typeText.charAt(index);
        if (char === "(") {
            depth++;
        } else if (char === ")") {
            depth--;
        }
        if (depth === 0 && index < typeText.length - 1) {
            return typeText;
        }
    }
    return typeText.slice(1, -1);
}

/**
 * Normalize a type printed by the TypeScript checker (as returned by
 * `vue-component-meta`):
 *
 * - optional props have `| undefined` appended by the checker, it is removed
 *   as optionality is presented separately.
 * - type literals are printed on a single line without trailing `;`.
 *
 * @internal
 */
export function normalizeResolvedType(
    typeText: string,
    required: boolean,
): string {
    let normalizedType = typeText;
    if (!required && normalizedType.endsWith(" | undefined")) {
        normalizedType = normalizedType.slice(0, -" | undefined".length);
    }
    return normalizeTypeText(unwrapParenthesis(normalizedType));
}

function getPropTypeArgument(expression: ts.Expression): ts.TypeNode | null {
    if (!ts.isAsExpression(expression)) {
        return null;
    }
    const assertedType = expression.type;
    if (
        ts.isTypeReferenceNode(assertedType) &&
        ts.isIdentifier(assertedType.typeName) &&
        assertedType.typeName.text === "PropType"
    ) {
        return assertedType.typeArguments?.[0] ?? null;
    }
    return null;
}

function findObjectProperty(
    objectLiteral: ts.ObjectLiteralExpression,
    propertyName: string,
): ts.ObjectLiteralElementLike | undefined {
    return objectLiteral.properties.find((property) => {
        return (
            property.name !== undefined &&
            ts.isIdentifier(property.name) &&
            property.name.text === propertyName
        );
    });
}

/**
 * Get the type exactly as the author wrote it from the prop declaration:
 *
 * - `foo?: Foo` and `foo?(a: number): Bar` (type based `defineProps()`)
 * - `foo: { type: X as PropType<Foo> }` and `foo: X as PropType<Foo>`
 *   (runtime props)
 *
 * Returns `null` when the declaration has no explicit type, in which case
 * the type resolved by the checker should be used instead. Types referring
 * to values (`typeof foo`) also return `null` as the resolved type is more
 * useful to the reader.
 *
 * @internal
 */
export function getDeclaredPropType(node: ts.Node | undefined): string | null {
    if (!node) {
        return null;
    }
    const sourceFile = node.getSourceFile();
    if (ts.isMethodSignature(node)) {
        return printMethodSignatureType(node, sourceFile);
    }

    let declaredTypeNode: ts.TypeNode | null = null;
    if (ts.isPropertySignature(node) && node.type) {
        declaredTypeNode = node.type;
    } else if (ts.isPropertyAssignment(node)) {
        const { initializer } = node;
        if (ts.isObjectLiteralExpression(initializer)) {
            const typeOption = findObjectProperty(initializer, "type");
            if (typeOption && ts.isPropertyAssignment(typeOption)) {
                declaredTypeNode = getPropTypeArgument(typeOption.initializer);
            }
        } else {
            declaredTypeNode = getPropTypeArgument(initializer);
        }
    }

    if (!declaredTypeNode) {
        return null;
    }
    const declaredType = printTypeNode(declaredTypeNode, sourceFile);
    if (/\btypeof\b/.test(declaredType)) {
        return null;
    }
    return declaredType;
}

/**
 * Get the default value for runtime props declaring `default` as a method,
 * e.g. `default() { return []; }`, which `vue-component-meta` does not
 * report.
 *
 * @internal
 */
export function getRuntimeMethodDefault(
    node: ts.Node | undefined,
): string | null {
    if (!node || !ts.isPropertyAssignment(node)) {
        return null;
    }
    const { initializer } = node;
    if (!ts.isObjectLiteralExpression(initializer)) {
        return null;
    }
    const defaultOption = findObjectProperty(initializer, "default");
    if (!defaultOption || !ts.isMethodDeclaration(defaultOption)) {
        return null;
    }
    const sourceFile = node.getSourceFile();
    const methodText = defaultOption.getText(sourceFile);
    const nameText = defaultOption.name.getText(sourceFile);
    return `function${methodText.slice(nameText.length)}`;
}

/**
 * @internal
 */
export interface EventArgument {
    readonly name: string;
    readonly type: string;
}

/**
 * Split the event payload type reported by `vue-component-meta`, e.g.
 * `[name: string, index: number]`, into separate arguments. Untyped events
 * (`any[]`) yield no arguments.
 *
 * @internal
 */
export function parseEventArguments(payloadType: string): EventArgument[] {
    const untypedPayloads = ["[]", "any[]", "unknown[]"];
    if (untypedPayloads.includes(payloadType)) {
        return [];
    }
    const sourceFile = ts.createSourceFile(
        "event-payload.ts",
        `type EventPayload = ${payloadType};`,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
    );
    const [statement] = sourceFile.statements;
    if (
        !ts.isTypeAliasDeclaration(statement) ||
        !ts.isTupleTypeNode(statement.type)
    ) {
        return [{ name: "<anonymous>", type: normalizeTypeText(payloadType) }];
    }
    return statement.type.elements.map((element): EventArgument => {
        if (ts.isNamedTupleMember(element)) {
            return {
                name: element.name.text,
                type: printTypeNode(element.type, sourceFile),
            };
        }
        return {
            name: "<anonymous>",
            type: printTypeNode(element, sourceFile),
        };
    });
}
