import { createRequire } from "node:module";
import { print } from "recast";
import {
    type Documentation,
    type ParseOptions,
    type PropDescriptor,
    type ScriptHandler,
} from "vue-docgen-api";

/*
 * vue-docgen-api parses scripts with Babel 7 while this package uses Babel 8,
 * whose AST differs for the nodes read here (e.g. `parameters` vs `params`).
 * The Babel 7 node types are therefore derived from the AST vue-docgen-api
 * passes to script handlers.
 */
type DocgenScriptAst = Parameters<ScriptHandler>[2];
type DocgenStatement = DocgenScriptAst["program"]["body"][number];
type DocgenExpression = Extract<
    DocgenStatement,
    { type: "ExpressionStatement" }
>["expression"];
type DocgenCallExpression = Extract<
    DocgenExpression,
    { type: "CallExpression" }
>;
type DocgenCallArgument = DocgenCallExpression["arguments"][number];
type DocgenIdentifier = Extract<DocgenExpression, { type: "Identifier" }>;
type DocgenTSType = Extract<
    DocgenStatement,
    { type: "TSTypeAliasDeclaration" }
>["typeAnnotation"];
type DocgenTSTypeElement = Extract<
    DocgenTSType,
    { type: "TSTypeLiteral" }
>["members"][number];
type DocgenTSMethodSignature = Extract<
    DocgenTSTypeElement,
    { type: "TSMethodSignature" }
>;
type DocgenTSPropertySignature = Extract<
    DocgenTSTypeElement,
    { type: "TSPropertySignature" }
>;

/** A `name?(...): T` member, which Vue treats as a prop of type `Function`. */
type MethodSignatureProp = DocgenTSMethodSignature & { key: DocgenIdentifier };

/** A `name?: T` member whose type annotation is present. */
type PropertySignatureProp = DocgenTSPropertySignature & {
    key: DocgenIdentifier;
    typeAnnotation: NonNullable<DocgenTSPropertySignature["typeAnnotation"]>;
};

/** The subset of an ast-types `NodePath` that `decorateItem()` reads. */
interface DocblockPath {
    readonly value: DocgenTSTypeElement;
    readonly parentPath: { readonly value: object };
}

interface DocgenInternals {
    /**
     * Resolves a local or imported interface or type alias to a path of its
     * members, including members of extended interfaces.
     */
    readonly getTypeDefinitionFromIdentifier: (
        scriptAst: DocgenScriptAst,
        typeName: string,
        parseOptions: ParseOptions,
        importName?: string,
    ) => { readonly value: DocgenTSTypeElement[] } | undefined;
    /** Sets description and tags on a descriptor from a member's docblock. */
    readonly decorateItem: (
        item: DocblockPath,
        propDescriptor: PropDescriptor,
    ) => void;
}

/**
 * The private props map of `Documentation`, a `ts-map` whose `delete()`
 * leaves the value behind, so it must be rebuilt rather than edited.
 * `entries()` returns a new array.
 */
interface DocumentationPropsMap {
    entries(): Array<[string, PropDescriptor]>;
    clear(): void;
    set(propName: string, propDescriptor: PropDescriptor): void;
}

/**
 * Keyword types vue-docgen-api has a name for (`TS_TYPE_NAME_MAP` in its
 * `getTypeFromAnnotation`).
 */
const docgenKeywordTypes = new Set([
    "TSAnyKeyword",
    "TSUnknownKeyword",
    "TSNumberKeyword",
    "TSObjectKeyword",
    "TSBooleanKeyword",
    "TSStringKeyword",
    "TSSymbolKeyword",
    "TSVoidKeyword",
    "TSUndefinedKeyword",
    "TSNullKeyword",
    "TSNeverKeyword",
]);

let docgenInternals: DocgenInternals | undefined;

/**
 * vue-docgen-api does not export the helpers its own `defineProps()` handler
 * uses and its `exports` map blocks deep imports, so they are loaded relative
 * to its entrypoint. The package is archived upstream and pinned to an exact
 * version, so its internal layout will not change.
 */
function getDocgenInternals(): DocgenInternals {
    if (docgenInternals) {
        return docgenInternals;
    }
    const requireFromHere = createRequire(import.meta.url);
    const docgenEntrypoint = requireFromHere.resolve("vue-docgen-api");
    const requireFromDocgen = createRequire(docgenEntrypoint);
    const tsUtils = requireFromDocgen(
        "./script-setup-handlers/utils/tsUtils.js",
    ) as Pick<DocgenInternals, "getTypeDefinitionFromIdentifier">;
    const typeAnnotationUtils = requireFromDocgen(
        "./utils/getTypeFromAnnotation.js",
    ) as Pick<DocgenInternals, "decorateItem">;
    docgenInternals = {
        getTypeDefinitionFromIdentifier:
            tsUtils.getTypeDefinitionFromIdentifier,
        decorateItem: typeAnnotationUtils.decorateItem,
    };
    return docgenInternals;
}

function isCallExpression(
    node: DocgenCallArgument | DocgenExpression | null | undefined,
): node is DocgenCallExpression {
    return node?.type === "CallExpression";
}

function isCallTo(calleeName: string, call: DocgenCallExpression): boolean {
    return call.callee.type === "Identifier" && call.callee.name === calleeName;
}

/**
 * Finds the `defineProps()` call, optionally wrapped in `withDefaults()`. As a
 * compiler macro it can only be used in a top-level statement.
 */
function findDefinePropsCall(
    program: DocgenScriptAst["program"],
): DocgenCallExpression | null {
    const topLevelExpressions = program.body.flatMap((statement) => {
        if (statement.type === "ExpressionStatement") {
            return [statement.expression];
        }
        if (statement.type === "VariableDeclaration") {
            return statement.declarations.map((declarator) => declarator.init);
        }
        return [];
    });
    for (const expression of topLevelExpressions) {
        if (!isCallExpression(expression)) {
            continue;
        }
        if (isCallTo("defineProps", expression)) {
            return expression;
        }
        if (!isCallTo("withDefaults", expression)) {
            continue;
        }
        const withDefaultsPropsArgument = expression.arguments[0];
        if (
            isCallExpression(withDefaultsPropsArgument) &&
            isCallTo("defineProps", withDefaultsPropsArgument)
        ) {
            return withDefaultsPropsArgument;
        }
    }
    return null;
}

/**
 * Returns the members of the props type in declaration order, resolving
 * interfaces and type aliases the same way vue-docgen-api does.
 */
function resolvePropsTypeMembers(
    propsType: DocgenTSType,
    scriptAst: DocgenScriptAst,
    parseOptions: ParseOptions,
): DocgenTSTypeElement[] {
    if (propsType.type === "TSTypeLiteral") {
        return propsType.members;
    }
    if (propsType.type !== "TSTypeReference") {
        return [];
    }
    const { getTypeDefinitionFromIdentifier } = getDocgenInternals();
    const { typeName } = propsType;
    if (typeName.type === "Identifier") {
        const definitionPath = getTypeDefinitionFromIdentifier(
            scriptAst,
            typeName.name,
            parseOptions,
        );
        return definitionPath?.value ?? [];
    }
    if (typeName.left.type !== "Identifier") {
        return [];
    }
    const definitionPath = getTypeDefinitionFromIdentifier(
        scriptAst,
        typeName.right.name,
        parseOptions,
        typeName.left.name,
    );
    return definitionPath?.value ?? [];
}

function isMethodSignatureProp(
    member: DocgenTSTypeElement,
): member is MethodSignatureProp {
    return (
        member.type === "TSMethodSignature" &&
        member.kind === "method" &&
        !member.computed &&
        member.key.type === "Identifier"
    );
}

function isPropertySignatureProp(
    member: DocgenTSTypeElement,
): member is PropertySignatureProp {
    return (
        member.type === "TSPropertySignature" &&
        member.key.type === "Identifier" &&
        Boolean(member.typeAnnotation)
    );
}

/**
 * Name of the prop a member declares, for every member either vue-docgen-api
 * or this handler documents.
 */
function getDeclaredPropName(member: DocgenTSTypeElement): string | null {
    if (isMethodSignatureProp(member)) {
        return member.key.name;
    }
    if (
        member.type === "TSPropertySignature" &&
        member.key.type === "Identifier"
    ) {
        return member.key.name;
    }
    return null;
}

/**
 * Tells if vue-docgen-api can describe the type, it names any other type after
 * its AST node, e.g. `TSFunctionType`. Mirrors `getTypeObjectFromTSType()` in
 * its `getTypeFromAnnotation`.
 */
function isTypeNamedByDocgen(type: DocgenTSType): boolean {
    switch (type.type) {
        case "TSUnionType":
        case "TSIntersectionType":
            return type.types.every(isTypeNamedByDocgen);
        case "TSArrayType":
            /* eslint-disable-next-line unicorn/no-useless-recursion -- tree walk, the other branches visit several children */
            return isTypeNamedByDocgen(type.elementType);
        case "TSTupleType":
            return type.elementTypes.every((elementType) => {
                return elementType.type === "TSNamedTupleMember"
                    ? isTypeNamedByDocgen(elementType.elementType)
                    : isTypeNamedByDocgen(elementType);
            });
        case "TSLiteralType":
            return (
                type.literal.type !== "UnaryExpression" &&
                type.literal.type !== "TemplateLiteral"
            );
        case "TSTypeLiteral":
            return true;
        case "TSTypeReference": {
            const typeArguments = type.typeParameters?.params ?? [];
            return (
                type.typeName.type === "Identifier" &&
                typeArguments.every(isTypeNamedByDocgen)
            );
        }
        default:
            return docgenKeywordTypes.has(type.type);
    }
}

/**
 * Prints a node on a single line. recast reuses the original source text for
 * nodes it parsed and pretty-prints nodes from imported files.
 */
function printOnSingleLine(node: Parameters<typeof print>[0]): string {
    return print(node).code.replaceAll(/\s*\n\s*/g, " ");
}

/**
 * Prints the method signature `name?<U>(a: U): R` as the function type
 * `<U>(a: U) => R`.
 */
function printMethodSignatureAsFunctionType(
    methodSignature: MethodSignatureProp,
): string {
    const { typeParameters, parameters, typeAnnotation } = methodSignature;
    const typeParametersText = typeParameters
        ? printOnSingleLine(typeParameters)
        : "";
    const parametersText = parameters.map(printOnSingleLine).join(", ");
    /* a method signature without return type implicitly returns `any` */
    const returnTypeText = typeAnnotation
        ? printOnSingleLine(typeAnnotation.typeAnnotation)
        : "any";
    return `${typeParametersText}(${parametersText}) => ${returnTypeText}`;
}

/**
 * Documents a method signature member the same way vue-docgen-api documents
 * property signature members.
 */
function documentMethodSignatureProp(
    documentation: Documentation,
    methodSignature: MethodSignatureProp,
): void {
    const { decorateItem } = getDocgenInternals();
    const propDescriptor = documentation.getPropDescriptor(
        methodSignature.key.name,
    );
    decorateItem(
        { value: methodSignature, parentPath: { value: {} } },
        propDescriptor,
    );
    propDescriptor.required = !methodSignature.optional;
    propDescriptor.type = {
        name: printMethodSignatureAsFunctionType(methodSignature),
    };
}

/**
 * Props from method signatures are added after the props vue-docgen-api
 * found, this moves them back into declaration order. Props not declared in
 * the type keep their relative order at the end.
 */
function restoreDeclarationOrder(
    documentation: Documentation,
    declaredPropNames: string[],
): void {
    const { propsMap } = documentation as unknown as {
        propsMap: DocumentationPropsMap;
    };
    const declarationIndex = (propName: string): number => {
        const index = declaredPropNames.indexOf(propName);
        return index === -1 ? declaredPropNames.length : index;
    };
    const sortedPropEntries = propsMap.entries().toSorted(([a], [b]) => {
        return declarationIndex(a) - declarationIndex(b);
    });
    propsMap.clear();
    for (const [propName, propDescriptor] of sortedPropEntries) {
        propsMap.set(propName, propDescriptor);
    }
}

/**
 * vue-docgen-api script handler for the members of the `defineProps<T>()`
 * type that vue-docgen-api itself misses or mistypes:
 *
 * - Method signatures, `fetchData?(page: number): Item[]`, are skipped
 *   entirely. They are documented here with a function type.
 * - Types vue-docgen-api cannot describe, such as the function type in
 *   `rowClass?: (row: T) => string`, are named after their AST node
 *   (`TSFunctionType`). They are replaced with the type's source text.
 *
 * Runs after the built-in handlers, which have already documented the
 * property signature members.
 *
 * @internal
 */
export const definePropsTypeHandler: ScriptHandler = (
    documentation,
    _componentDefinition,
    scriptAst,
    parseOptions,
) => {
    const definePropsCall = findDefinePropsCall(scriptAst.program);
    const propsType = definePropsCall?.typeParameters?.params[0];
    if (!propsType) {
        return Promise.resolve();
    }

    const propsTypeMembers = resolvePropsTypeMembers(
        propsType,
        scriptAst,
        parseOptions,
    );
    const methodSignatureProps = propsTypeMembers.filter(isMethodSignatureProp);
    const propertySignatureProps = propsTypeMembers.filter(
        isPropertySignatureProp,
    );

    for (const methodSignature of methodSignatureProps) {
        documentMethodSignatureProp(documentation, methodSignature);
    }

    for (const propertySignature of propertySignatureProps) {
        const propType = propertySignature.typeAnnotation.typeAnnotation;
        if (isTypeNamedByDocgen(propType)) {
            continue;
        }
        const propDescriptor = documentation.getPropDescriptor(
            propertySignature.key.name,
        );
        propDescriptor.type = { name: printOnSingleLine(propType) };
    }

    if (methodSignatureProps.length > 0) {
        const declaredPropNames = propsTypeMembers
            .map(getDeclaredPropName)
            .filter((propName) => propName !== null);
        restoreDeclarationOrder(documentation, declaredPropNames);
    }

    return Promise.resolve();
};
