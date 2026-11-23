import fs from "node:fs/promises";
import path from "node:path";
import type ts from "typescript";
import {
    type ComponentMeta,
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
    getDeclaredPropType,
    getRuntimeMethodDefault,
    normalizeResolvedType,
    parseEventArguments,
} from "./component-type";
import {
    type DocTag,
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

/**
 * Name of the prop Vue generates for an event listener, `update:modelValue`
 * becomes `onUpdate:modelValue` (same as `toHandlerKey()` in `@vue/shared`).
 */
function toHandlerKey(eventName: string): string {
    const camelized = camelize(eventName);
    return `on${camelized.charAt(0).toUpperCase()}${camelized.slice(1)}`;
}

function isSameFile(a: string, b: string): boolean {
    return path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
}

/**
 * Find the AST node for the declaration `vue-component-meta` reports for a
 * prop, either in the SFC itself or in an imported TypeScript file.
 */
function findPropDeclarationNode(
    context: TranslateContext,
    prop: PropertyMeta,
): ts.Node | undefined {
    const declaration = prop.getDeclarations().at(0);
    if (!declaration) {
        return undefined;
    }
    const [start, end] = declaration.range;
    if (isSameFile(declaration.file, context.componentFile)) {
        return context.sfc.findNodeAt(start, end);
    }
    return findNodeInProgramFile(context.program, declaration.file, start, end);
}

/**
 * Sort key placing props in declaration order: props declared in the
 * component first, then props from other files (e.g. an extended interface)
 * and last props without any declaration (e.g. `defineModel()`).
 */
function getDeclarationSortKey(
    context: TranslateContext,
    prop: PropertyMeta,
): [number, string, number] {
    const declaration = prop.getDeclarations().at(0);
    if (!declaration) {
        return [2, "", 0];
    }
    const fileRank = isSameFile(declaration.file, context.componentFile)
        ? 0
        : 1;
    return [fileRank, declaration.file, declaration.range[0]];
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
    const defaultValue =
        prop.default ?? getRuntimeMethodDefault(declarationNode);
    return {
        name: prop.name,
        description: prop.description === "" ? null : prop.description,
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
    const eventHandlerProps = new Set(Array.from(eventNames, toHandlerKey));
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

/**
 * Match `@param name - description`, `@param {type} name description` and
 * `@property {type} name description` tags with event arguments.
 */
function findArgumentTag(
    tags: DocTag[],
    argumentName: string,
): { type: string | null; description: string | null } | null {
    for (const tag of tags) {
        if (tag.name !== "param" && tag.name !== "property") {
            continue;
        }
        const namedTag = parseNamedTag(tag.text);
        if (namedTag?.name !== argumentName) {
            continue;
        }
        return { type: namedTag.type, description: namedTag.description };
    }
    return null;
}

function translateEventProperties(
    eventMeta: EventMeta | undefined,
    tags: DocTag[],
): EventProperty[] {
    const eventArguments = eventMeta ? parseEventArguments(eventMeta.type) : [];
    if (eventArguments.length > 0) {
        return eventArguments.map((eventArgument): EventProperty => {
            const argumentTag = findArgumentTag(tags, eventArgument.name);
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
    const typeTagMatch = typeTag
        ? /^\{(?<type>[\s\S]*)\}/.exec(typeTag.text)
        : null;
    if (typeTagMatch?.groups) {
        return [
            {
                name: "<anonymous>",
                type: typeTagMatch.groups.type.trim(),
                description: null,
            },
        ];
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
): ComponentEvent[] {
    const metaEventsByName = new Map(
        metaEvents.map((event) => [event.name, event]),
    );
    const sourceEventsByName = new Map(
        context.sfc.events.map((event) => [event.name, event]),
    );
    const eventNames = new Set([
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
        const metaDescription = emptyToNull(eventMeta?.description);
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
                description:
                    bindingProp.description === ""
                        ? null
                        : bindingProp.description,
            };
        },
    );
}

/**
 * Bindings documented with `@binding` take precedence (in documented order),
 * remaining bindings from the slot type are appended.
 */
function mergeSlotBindings(
    documentedBindings: ReadonlyArray<{
        name: string;
        type: string | null;
        description: string | null;
    }>,
    typeBindings: SlotBinding[],
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
    return [...mergedDocumentedBindings, ...undocumentedBindings];
}

function translateSlots(
    context: TranslateContext,
    metaSlots: SlotMeta[],
): ComponentSlot[] {
    const metaSlotsByName = new Map(metaSlots.map((slot) => [slot.name, slot]));
    const sourceSlotsByName = new Map(
        context.sfc.slots.map((slot) => [slot.name, slot]),
    );
    const slotNames = new Set([
        ...metaSlots.map((slot) => slot.name),
        ...context.sfc.slots.map((slot) => slot.name),
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
        const metaDescription = emptyToNull(slotMeta?.description);
        translatedSlots.push({
            name: slotName,
            description: sourceSlot?.description ?? metaDescription,
            bindings: mergeSlotBindings(
                sourceSlot?.bindings ?? [],
                getSlotTypeBindings(slotMeta),
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
): {
    models: ComponentModel[];
    props: ComponentProp[];
    events: ComponentEvent[];
} {
    const modelPropNames = new Set<string>();
    const models: ComponentModel[] = [];
    for (const event of rawEvents) {
        if (!event.name.startsWith("update:")) {
            continue;
        }
        const propName = event.name.slice("update:".length);
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

        const rawEvents = translateEvents(context, meta.events);
        /* includes ignored events so their listener props are hidden as well */
        const allEventNames = new Set([
            ...context.sfc.events.map((event) => event.name),
            ...meta.events.map((event) => event.name),
        ]);
        const rawProps = translateProps(context, meta.props, allEventNames);
        const { models, props, events } = filterModels(rawProps, rawEvents);
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
