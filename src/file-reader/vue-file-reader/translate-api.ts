import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import type ts from "typescript";
import {
    type ComponentMeta,
    type Declaration,
    type EventMeta,
    type PropertyMeta,
    type PropertyMetaSchema,
    type SlotMeta,
} from "vue-component-meta";
import { slugify } from "../../utils";
import {
    type ComponentAPI,
    type ComponentEvent,
    type ComponentModel,
    type ComponentProp,
    type ComponentSlot,
} from "./component-api";
import {
    type ComponentMetaChecker,
    type VueFileReaderOptions,
    getComponentMetaChecker,
} from "./component-meta-checker";
import {
    dedentFunctionText,
    getDeclaredPropType,
    getRuntimeDefault,
    isFunctionType,
    normalizeResolvedType,
    parseEventArguments,
    unwrapDefaultFactory,
} from "./component-type";
import {
    type DocTag,
    type NamedTag,
    emptyToNull,
    getDeprecatedText,
    hasIgnoreTag,
    parseNamedTag,
} from "./parse-jsdoc";
import {
    type SfcSource,
    findNodeInProgramFile,
    parseSfcSource,
} from "./sfc-source";

type EventProperty = ComponentEvent["properties"][number];
type SlotBinding = ComponentSlot["bindings"][number];

interface TranslateContext {
    readonly componentFile: string;
    readonly sfc: SfcSource;
    readonly program: ts.Program | undefined;
}

function toDocTags(
    tags: ReadonlyArray<{ name: string; text?: string }>,
): DocTag[] {
    return tags.map((tag) => ({ name: tag.name, text: tag.text ?? "" }));
}

function camelize(name: string): string {
    return name.replaceAll(/-(\w)/g, (_, char: string) => char.toUpperCase());
}

function capitalize(name: string): string {
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

/**
 * Names of the props Vue generates for an event listener: the types use
 * `on${Capitalize<name>}` (`onGroup-validity`) while the runtime camelizes
 * (`onGroupValidity`, same as `toHandlerKey()` in `@vue/shared`).
 */
function toHandlerKeys(eventName: string): string[] {
    return [
        `on${capitalize(eventName)}`,
        `on${capitalize(camelize(eventName))}`,
    ];
}

function isSameFile(a: string, b: string): boolean {
    return path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
}

/**
 * The declaration used for a prop: a prop can be declared in several places
 * (e.g. overridden when using `extends`), the one in the component itself
 * takes precedence.
 */
function getPreferredDeclaration(
    context: TranslateContext,
    prop: PropertyMeta,
): Declaration | undefined {
    const declarations = prop.getDeclarations();
    const ownDeclaration = declarations.find((declaration) => {
        return isSameFile(declaration.file, context.componentFile);
    });
    return ownDeclaration ?? declarations.at(0);
}

/**
 * Find the AST node for the declaration `vue-component-meta` reports for a
 * prop: in the SFC itself, in another SFC (`extends`) or in an imported
 * TypeScript file.
 */
function findPropDeclarationNode(
    context: TranslateContext,
    prop: PropertyMeta,
): ts.Node | undefined {
    const declaration = getPreferredDeclaration(context, prop);
    if (!declaration) {
        return undefined;
    }
    const [start, end] = declaration.range;
    if (isSameFile(declaration.file, context.componentFile)) {
        return context.sfc.findNodeAt(start, end);
    }
    if (declaration.file.endsWith(".vue")) {
        const declaringSource = readFileSync(declaration.file, "utf8");
        const declaringSfc = parseSfcSource(declaration.file, declaringSource);
        return declaringSfc.findNodeAt(start, end);
    }
    return findNodeInProgramFile(context.program, declaration.file, start, end);
}

/**
 * Sort key placing props in declaration order: inherited props (e.g.
 * `extends` or an extended interface) first, then props declared in the
 * component and last props without any declaration (e.g. `defineModel()`).
 */
function getDeclarationSortKey(
    context: TranslateContext,
    prop: PropertyMeta,
): [number, string, number] {
    /* a prop overridden by the component keeps the position it has in the
     * component it inherits from */
    const declarations = prop.getDeclarations();
    const inheritedDeclaration = declarations.find((declaration) => {
        return !isSameFile(declaration.file, context.componentFile);
    });
    const declaration = inheritedDeclaration ?? declarations.at(0);
    if (!declaration) {
        return [2, "", 0];
    }
    const fileRank = inheritedDeclaration ? 0 : 1;
    return [fileRank, declaration.file, declaration.range[0]];
}

/**
 * Event listener props generated from `emits` in a component inherited from
 * a compiled package (e.g. `extends: FTextField` imported from `@fkui/vue`),
 * which neither `vue-component-meta` nor the source pass reports as events.
 * Recognized as `onFoo` function props only declared in `.d.ts` files.
 */
function getInheritedListenerEvents(props: PropertyMeta[]): string[] {
    return props
        .filter((prop) => {
            const declarations = prop.getDeclarations();
            return (
                !prop.global &&
                /^on[A-Z]/.test(prop.name) &&
                declarations.length > 0 &&
                declarations.every((it) => it.file.endsWith(".d.ts")) &&
                isFunctionType(prop.getTypeObject())
            );
        })
        .map(
            (prop) =>
                `${prop.name.charAt(2).toLowerCase()}${prop.name.slice(3)}`,
        );
}

/**
 * Default value as presented in the documentation, `null` when the prop has
 * no (meaningful) default.
 */
function getPropDefault(
    context: TranslateContext,
    prop: PropertyMeta,
    declarationNode: ts.Node | undefined,
): string | null {
    const functionType = isFunctionType(prop.getTypeObject());
    const runtimeDefault = getRuntimeDefault(declarationNode, functionType);
    /* `vue-component-meta` unwraps `withDefaults()` factories with an
     * expression body only, and also for function props where the default is
     * not a factory, so the default is taken as written instead */
    const withDefaultsText = context.sfc.withDefaults.get(prop.name);
    let withDefaultsValue: string | undefined;
    if (withDefaultsText !== undefined) {
        withDefaultsValue = functionType
            ? dedentFunctionText(withDefaultsText)
            : unwrapDefaultFactory(withDefaultsText);
    }
    const defaultValue = runtimeDefault ?? withDefaultsValue ?? prop.default;
    if (defaultValue === undefined || defaultValue === "undefined") {
        return null;
    }
    return defaultValue;
}

function compareSortKeys(
    a: [number, string, number],
    b: [number, string, number],
): number {
    return a[0] - b[0] || a[1].localeCompare(b[1]) || a[2] - b[2];
}

function translateProp(
    context: TranslateContext,
    prop: PropertyMeta,
): ComponentProp {
    const declarationNode = findPropDeclarationNode(context, prop);
    const declaredType = getDeclaredPropType(declarationNode);
    const defaultValue = getPropDefault(context, prop, declarationNode);
    return {
        name: prop.name,
        description: emptyToNull(prop.description.trim()),
        type: declaredType ?? normalizeResolvedType(prop.type, prop.required),
        required: prop.required,
        default: defaultValue === null ? null : { value: defaultValue },
        deprecated: getDeprecatedText(prop.tags),
    };
}

function translateProps(
    context: TranslateContext,
    props: PropertyMeta[],
    eventNames: ReadonlySet<string>,
): ComponentProp[] {
    /* Vue exposes event listeners as `onFoo` props, those are already
     * presented as events. This also covers events `vue-component-meta` fails
     * to detect (e.g. `emits: ["foo", "bar"]`) since the props remain. */
    const eventHandlerProps = new Set(
        Array.from(eventNames).flatMap(toHandlerKeys),
    );
    const relevantProps = props.filter((prop) => {
        return (
            !prop.global &&
            !eventHandlerProps.has(prop.name) &&
            !hasIgnoreTag(prop.tags)
        );
    });
    const sortedProps = relevantProps.toSorted((a, b) => {
        return compareSortKeys(
            getDeclarationSortKey(context, a),
            getDeclarationSortKey(context, b),
        );
    });
    return sortedProps.map((prop) => translateProp(context, prop));
}

/* tags documenting event arguments, `@arg` and `@argument` are aliases
 * supported by vue-docgen-api */
const argumentTagNames = new Set(["param", "arg", "argument", "property"]);

/**
 * Event arguments documented with `@param name - description`,
 * `@arg {type} name description`, `@property {type} name description` etc.
 */
function getArgumentTags(tags: DocTag[]): NamedTag[] {
    return tags
        .filter((tag) => argumentTagNames.has(tag.name))
        .map((tag) => parseNamedTag(tag.text))
        .filter((namedTag) => namedTag !== null);
}

function translateEventProperties(
    eventMeta: EventMeta | undefined,
    tags: DocTag[],
): EventProperty[] {
    const argumentTags = getArgumentTags(tags);
    const eventArguments = eventMeta ? parseEventArguments(eventMeta.type) : [];
    if (eventArguments.length > 0) {
        return eventArguments.map((eventArgument): EventProperty => {
            const argumentTag = argumentTags.find((it) => {
                return it.name === eventArgument.name;
            });
            return {
                name: eventArgument.name,
                type: eventArgument.type,
                description: argumentTag?.description ?? null,
            };
        });
    }
    /* untyped events (`emits: ["foo"]`) may document the payload with
     * `@type {Foo}` (vue-docgen-api convention) */
    const typeTag = tags.find((tag) => tag.name === "type");
    const payloadType = typeTag
        ? parseNamedTag(`${typeTag.text} payload`)?.type
        : null;
    /* ... and name it with `@param`, `@arg` or `@property` */
    if (argumentTags.length > 0) {
        const typeFromTypeTag =
            argumentTags.length === 1 ? (payloadType ?? null) : null;
        return argumentTags.map((argumentTag): EventProperty => {
            return {
                name: argumentTag.name,
                type: argumentTag.type ?? typeFromTypeTag ?? "unknown",
                description: argumentTag.description,
            };
        });
    }
    if (payloadType) {
        return [{ name: "<anonymous>", type: payloadType, description: null }];
    }
    return [];
}

/**
 * Merge events reported by `vue-component-meta` (names and payload types)
 * with events and doc comments found in the source (`vue-component-meta`
 * does not report doc comments for events).
 */
function translateEvents(
    context: TranslateContext,
    metaEvents: EventMeta[],
    inheritedListenerEvents: string[],
): ComponentEvent[] {
    const metaEventsByName = new Map(
        metaEvents.map((event) => [event.name, event]),
    );
    const sourceEventsByName = new Map(
        context.sfc.events.map((event) => [event.name, event]),
    );
    const eventNames = new Set([
        ...inheritedListenerEvents,
        ...context.sfc.events.map((event) => event.name),
        ...metaEvents.map((event) => event.name),
    ]);

    const translatedEvents: ComponentEvent[] = [];
    for (const eventName of eventNames) {
        const eventMeta = metaEventsByName.get(eventName);
        const sourceEvent = sourceEventsByName.get(eventName);
        const tags = [
            ...(sourceEvent?.tags ?? []),
            ...toDocTags(eventMeta?.tags ?? []),
        ];
        if (hasIgnoreTag(tags)) {
            continue;
        }
        const metaDescription = emptyToNull(eventMeta?.description.trim());
        translatedEvents.push({
            name: eventName,
            description: sourceEvent?.description ?? metaDescription,
            properties: translateEventProperties(eventMeta, tags),
            deprecated: getDeprecatedText(tags),
        });
    }
    return translatedEvents;
}

function isObjectSchema(
    schema: PropertyMetaSchema,
): schema is Extract<PropertyMetaSchema, { kind: "object" }> {
    return typeof schema === "object" && schema.kind === "object";
}

/**
 * Bindings as resolved from the slot type: `defineSlots()` or inferred by
 * Vue from `<slot :foo="bar">` in the template.
 */
function getSlotTypeBindings(slot: SlotMeta | undefined): SlotBinding[] {
    if (!slot || !isObjectSchema(slot.schema)) {
        return [];
    }
    return Object.values(slot.schema.schema ?? {}).map(
        (bindingProp): SlotBinding => {
            return {
                name: bindingProp.name,
                type: normalizeResolvedType(
                    bindingProp.type,
                    bindingProp.required,
                ),
                description: emptyToNull(bindingProp.description.trim()),
            };
        },
    );
}

/**
 * Bindings documented with `@binding` take precedence (in documented order),
 * remaining bindings from the slot type are appended followed by bindings
 * only known from the `<slot>` attributes (options API components, where
 * `vue-component-meta` reports no slots).
 */
function mergeSlotBindings(
    documentedBindings: readonly NamedTag[],
    typeBindings: SlotBinding[],
    attributeBindings: readonly string[],
): SlotBinding[] {
    const typeBindingsByName = new Map(
        typeBindings.map((binding) => [binding.name, binding]),
    );
    const documentedNames = new Set(
        documentedBindings.map((binding) => binding.name),
    );
    const mergedDocumentedBindings = documentedBindings.map(
        (binding): SlotBinding => {
            const typeBinding = typeBindingsByName.get(binding.name);
            return {
                name: binding.name,
                type: binding.type ?? typeBinding?.type ?? "unknown",
                description:
                    binding.description ?? typeBinding?.description ?? null,
            };
        },
    );
    const undocumentedBindings = typeBindings.filter(
        (binding) => !documentedNames.has(binding.name),
    );
    const knownNames = new Set([
        ...documentedNames,
        ...typeBindings.map((binding) => binding.name),
    ]);
    const untypedBindings = attributeBindings
        .filter((name) => !knownNames.has(name))
        .map((name): SlotBinding => ({
            name,
            type: "unknown",
            description: null,
        }));
    return [
        ...mergedDocumentedBindings,
        ...undocumentedBindings,
        ...untypedBindings,
    ];
}

function translateSlots(
    context: TranslateContext,
    metaSlots: SlotMeta[],
): ComponentSlot[] {
    const metaSlotsByName = new Map(metaSlots.map((slot) => [slot.name, slot]));
    const sourceSlotsByName = new Map(
        context.sfc.slots.map((slot) => [slot.name, slot]),
    );
    /* template order first, `defineSlots()` only slots last */
    const slotNames = new Set([
        ...context.sfc.slots.map((slot) => slot.name),
        ...metaSlots.map((slot) => slot.name),
    ]);

    const translatedSlots: ComponentSlot[] = [];
    for (const slotName of slotNames) {
        const slotMeta = metaSlotsByName.get(slotName);
        const sourceSlot = sourceSlotsByName.get(slotName);
        const tags = [
            ...(sourceSlot?.tags ?? []),
            ...toDocTags(slotMeta?.tags ?? []),
        ];
        if (hasIgnoreTag(tags)) {
            continue;
        }
        const metaDescription = emptyToNull(slotMeta?.description.trim());
        translatedSlots.push({
            name: slotName,
            description: sourceSlot?.description ?? metaDescription,
            bindings: mergeSlotBindings(
                sourceSlot?.bindings ?? [],
                getSlotTypeBindings(slotMeta),
                sourceSlot?.attributeBindings ?? [],
            ),
            deprecated: getDeprecatedText(tags),
        });
    }
    return translatedSlots;
}

/**
 * Filter v-models by comparing component props and events.
 *
 * @internal
 * @param rawProps - Translated props.
 * @param rawEvents - Translated events.
 * @returns Object with array of only models as well as props and events without models.
 */
function filterModels(
    rawProps: ComponentProp[],
    rawEvents: ComponentEvent[],
    allEventNames: ReadonlySet<string>,
): {
    models: ComponentModel[];
    props: ComponentProp[];
    events: ComponentEvent[];
} {
    const modelPropNames = new Set<string>();
    const models: ComponentModel[] = [];
    /* all event names, an `update:foo` event hidden with `@ignore` still
     * makes `foo` a model */
    for (const eventName of allEventNames) {
        if (!eventName.startsWith("update:")) {
            continue;
        }
        const propName = eventName.slice("update:".length);
        const prop = rawProps.find((it) => it.name === propName);
        if (!prop) {
            continue;
        }
        modelPropNames.add(propName);
        models.push({
            ...prop,
            name: propName === "modelValue" ? "v-model" : `v-model:${propName}`,
        });
    }

    const events = rawEvents.filter((it) => !it.name.startsWith("update:"));
    /* `defineModel()` also declares `modelModifiers` / `fooModifiers` */
    const props = rawProps.filter((prop) => {
        const isModelProp = modelPropNames.has(prop.name);
        const isModifiersProp =
            prop.name === "modelModifiers" ||
            (prop.name.endsWith("Modifiers") &&
                modelPropNames.has(prop.name.slice(0, -"Modifiers".length)));
        return !isModelProp && !isModifiersProp;
    });

    return { models, props, events };
}

function getComponentMeta(
    checker: ComponentMetaChecker,
    filePath: string,
): ComponentMeta {
    return checker.getComponentMeta(
        path.resolve(filePath).replaceAll("\\", "/"),
    );
}

/**
 * Translates output from a vue component parser to general interface.
 * If the parser is changed the translation functions need to be updated to match its interface.
 *
 * Component metadata is extracted with `vue-component-meta` (i.e. from the
 * types Vue itself infers) while doc comments for events and template slots,
 * which `vue-component-meta` does not report, are read from the source.
 *
 * @internal
 */
export async function translateAPI(
    filePath: string,
    options: VueFileReaderOptions = {},
): Promise<ComponentAPI> {
    try {
        const source = await fs.readFile(filePath, "utf8");
        const checker = getComponentMetaChecker(filePath, source, options);
        const meta = getComponentMeta(checker, filePath);
        const context: TranslateContext = {
            componentFile: filePath,
            sfc: parseSfcSource(filePath, source),
            program: checker.getProgram(),
        };

        const inheritedListenerEvents = getInheritedListenerEvents(meta.props);
        const rawEvents = translateEvents(
            context,
            meta.events,
            inheritedListenerEvents,
        );
        /* includes ignored events so their listener props are hidden as well */
        const allEventNames = new Set([
            ...inheritedListenerEvents,
            ...context.sfc.events.map((event) => event.name),
            ...meta.events.map((event) => event.name),
        ]);
        const rawProps = translateProps(context, meta.props, allEventNames);
        const { models, props, events } = filterModels(
            rawProps,
            rawEvents,
            allEventNames,
        );
        const slots = translateSlots(context, meta.slots);
        const name = meta.name ?? path.parse(filePath).name;

        return {
            name,
            slug: slugify(name),
            models,
            props,
            events,
            slots,
        };
    } catch (err) {
        throw new Error(
            `Failed to generate API description from "${filePath}"`,
            { cause: err },
        );
    }
}
