import path from "node:path";
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

function findArrayConstant(
    sourceFile: ts.SourceFile,
    constantName: string,
): ts.ArrayLiteralExpression | null {
    for (const statement of sourceFile.statements) {
        if (!ts.isVariableStatement(statement)) {
            continue;
        }
        for (const declaration of statement.declarationList.declarations) {
            const isMatch =
                ts.isIdentifier(declaration.name) &&
                declaration.name.text === constantName;
            if (isMatch && declaration.initializer) {
                return resolveArrayLiteral(declaration.initializer);
            }
        }
    }
    return null;
}

/**
 * Find a constant imported with a relative import, e.g.
 * `import { ALIGNMENT } from "./constants"`.
 */
function findImportedArrayConstant(
    sourceFile: ts.SourceFile,
    constantName: string,
): ts.ArrayLiteralExpression | null {
    for (const statement of sourceFile.statements) {
        if (
            !ts.isImportDeclaration(statement) ||
            !ts.isStringLiteral(statement.moduleSpecifier)
        ) {
            continue;
        }
        const namedBindings = statement.importClause?.namedBindings;
        const importSpecifier =
            namedBindings && ts.isNamedImports(namedBindings)
                ? namedBindings.elements.find(
                      (it) => it.name.text === constantName,
                  )
                : undefined;
        const moduleName = statement.moduleSpecifier.text;
        if (!importSpecifier || !moduleName.startsWith(".")) {
            continue;
        }
        const exportedName = (
            importSpecifier.propertyName ?? importSpecifier.name
        ).text;
        const basePath = path.resolve(
            path.dirname(sourceFile.fileName),
            moduleName,
        );
        const candidates = [
            basePath,
            `${basePath}.ts`,
            `${basePath}.js`,
            path.join(basePath, "index.ts"),
        ];
        const modulePath = candidates.find((it) => ts.sys.fileExists(it));
        const moduleText = modulePath ? ts.sys.readFile(modulePath) : undefined;
        if (!modulePath || moduleText === undefined) {
            return null;
        }
        const moduleSourceFile = ts.createSourceFile(
            modulePath,
            moduleText,
            ts.ScriptTarget.Latest,
            true,
        );
        return findArrayConstant(moduleSourceFile, exportedName);
    }
    return null;
}

/**
 * Resolve an expression to an array literal, following `as const` and
 * identifiers declared as a `const` in the same file or imported from a
 * relative module, e.g. `const ALIGNMENT = ["top", "bottom"] as const`.
 */
function resolveArrayLiteral(
    expression: ts.Expression,
): ts.ArrayLiteralExpression | null {
    let unwrapped = expression;
    while (
        ts.isAsExpression(unwrapped) ||
        ts.isParenthesizedExpression(unwrapped)
    ) {
        unwrapped = unwrapped.expression;
    }
    if (ts.isArrayLiteralExpression(unwrapped)) {
        return unwrapped;
    }
    if (!ts.isIdentifier(unwrapped)) {
        return null;
    }
    const sourceFile = unwrapped.getSourceFile();
    return (
        findArrayConstant(sourceFile, unwrapped.text) ??
        findImportedArrayConstant(sourceFile, unwrapped.text)
    );
}

/**
 * `undefined` and `null` in the list of allowed values only make the prop
 * optional and are not part of the presented type.
 */
function isNullishLiteral(element: ts.Expression): boolean {
    return (
        element.kind === ts.SyntaxKind.NullKeyword ||
        (ts.isIdentifier(element) && element.text === "undefined")
    );
}

/**
 * Derive a union of string literals from a prop validator checking the value
 * against a list, the convention supported by vue-docgen-api:
 *
 * - `validator(value) { return ["a", "b"].includes(value); }`
 * - `validator: (value) => ALLOWED.includes(value)`
 * - `validator(value) { return ["a", "b"].indexOf(value) !== -1; }`
 */
function getValidatorEnumType(
    propOptions: ts.ObjectLiteralExpression,
): string | null {
    const validatorOption = findObjectProperty(propOptions, "validator");
    if (!validatorOption) {
        return null;
    }
    let enumType: string | null = null;
    const visit = (node: ts.Node): void => {
        if (enumType !== null) {
            return;
        }
        const isListCheck =
            ts.isCallExpression(node) &&
            ts.isPropertyAccessExpression(node.expression) &&
            ["includes", "indexOf"].includes(node.expression.name.text);
        const list = isListCheck
            ? resolveArrayLiteral(node.expression.expression)
            : null;
        const elements = list?.elements.filter((it) => !isNullishLiteral(it));
        const values = elements?.filter((element) => {
            return ts.isStringLiteralLike(element);
        });
        const isStringList =
            values !== undefined &&
            values.length > 0 &&
            values.length === elements?.length;
        if (isStringList) {
            enumType = values.map((it) => JSON.stringify(it.text)).join(" | ");
            return;
        }
        ts.forEachChild(node, visit);
    };
    visit(validatorOption);
    return enumType;
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
            /* `type: String` (or `PropType<string>`) with
             * `validator() { return [..].includes(v) }` */
            const isPlainString =
                !declaredTypeNode ||
                declaredTypeNode.kind === ts.SyntaxKind.StringKeyword;
            const validatorEnumType = isPlainString
                ? getValidatorEnumType(initializer)
                : null;
            if (validatorEnumType || !declaredTypeNode) {
                return validatorEnumType;
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
 * Remove the indentation the function had in the source from all lines but
 * the first, so `default() {\n            return 1;\n        }` is presented as
 * `function() {\n    return 1;\n}`.
 */
export function dedentFunctionText(text: string): string {
    const lines = text.replaceAll("\r\n", "\n").split("\n");
    const indentedLines = lines.slice(1).filter((line) => line.trim() !== "");
    if (indentedLines.length === 0) {
        return text;
    }
    const commonIndent = Math.min(
        ...indentedLines.map((line) => line.length - line.trimStart().length),
    );
    return [
        lines[0],
        ...lines.slice(1).map((line) => line.slice(commonIndent)),
    ].join("\n");
}

/**
 * Returns the expression of a function with a single `return` statement (or
 * an expression body), i.e. the value a default factory produces.
 */
function getFactoryValue(
    factory: ts.MethodDeclaration | ts.ArrowFunction | ts.FunctionExpression,
): ts.Expression | null {
    const { body } = factory;
    if (!body) {
        return null;
    }
    if (!ts.isBlock(body)) {
        return body;
    }
    if (body.statements.length !== 1) {
        return null;
    }
    const [statement] = body.statements;
    if (!ts.isReturnStatement(statement)) {
        return null;
    }
    return statement.expression ?? null;
}

/**
 * Check if a (possibly optional) prop type is a function type, in which case
 * Vue uses the `default` as-is instead of calling it as a factory.
 *
 * @internal
 */
export function isFunctionType(type: ts.Type): boolean {
    const constituents = type.isUnion() ? type.types : [type];
    const nullishFlags = ts.TypeFlags.Undefined | ts.TypeFlags.Null;
    const nonNullish = constituents.filter((it) => !(it.flags & nullishFlags));
    return (
        nonNullish.length > 0 &&
        nonNullish.every((it) => it.getCallSignatures().length > 0)
    );
}

/**
 * Present a `withDefaults()` default for a prop that is not a function: a
 * factory returning a single value (`() => { return []; }`) is presented as
 * the value (`[]`), same as for runtime props.
 *
 * @internal
 */
export function unwrapDefaultFactory(defaultText: string): string {
    const sourceFile = ts.createSourceFile(
        "default.ts",
        `(${defaultText});`,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
    );
    const [statement] = sourceFile.statements;
    if (!ts.isExpressionStatement(statement)) {
        return defaultText;
    }
    let expression = statement.expression;
    while (ts.isParenthesizedExpression(expression)) {
        expression = expression.expression;
    }
    if (
        !ts.isArrowFunction(expression) &&
        !ts.isFunctionExpression(expression)
    ) {
        return defaultText;
    }
    const factoryValue = getFactoryValue(expression);
    if (!factoryValue) {
        return dedentFunctionText(defaultText);
    }
    return dedentFunctionText(factoryValue.getText(sourceFile));
}

/**
 * Get the default value of a runtime prop (`foo: { default: ... }`) from the
 * declaration, as `vue-component-meta` does not report method defaults and
 * unwraps `() => value` also for function props where it is not a factory.
 *
 * - function props: the function as written.
 * - other props: the value returned by the factory if it is a single
 *   expression, else the factory as written.
 *
 * Returns `undefined` when the declaration has no `default` option.
 *
 * @internal
 */
export function getRuntimeDefault(
    node: ts.Node | undefined,
    functionType: boolean,
): string | undefined {
    if (!node || !ts.isPropertyAssignment(node)) {
        return undefined;
    }
    const { initializer } = node;
    if (!ts.isObjectLiteralExpression(initializer)) {
        return undefined;
    }
    const defaultOption = findObjectProperty(initializer, "default");
    if (!defaultOption) {
        return undefined;
    }
    const sourceFile = node.getSourceFile();
    let factory:
        ts.MethodDeclaration | ts.ArrowFunction | ts.FunctionExpression | null =
        null;
    if (ts.isMethodDeclaration(defaultOption)) {
        factory = defaultOption;
    } else if (ts.isPropertyAssignment(defaultOption)) {
        const defaultValue = defaultOption.initializer;
        if (
            ts.isArrowFunction(defaultValue) ||
            ts.isFunctionExpression(defaultValue)
        ) {
            factory = defaultValue;
        } else {
            return dedentFunctionText(defaultValue.getText(sourceFile));
        }
    }
    if (!factory) {
        return undefined;
    }
    const factoryValue = functionType ? null : getFactoryValue(factory);
    if (factoryValue) {
        return dedentFunctionText(factoryValue.getText(sourceFile));
    }
    const factoryText = factory.getText(sourceFile);
    if (ts.isMethodDeclaration(factory)) {
        const nameText = factory.name.getText(sourceFile);
        return dedentFunctionText(
            `function${factoryText.slice(nameText.length)}`,
        );
    }
    return dedentFunctionText(factoryText);
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
