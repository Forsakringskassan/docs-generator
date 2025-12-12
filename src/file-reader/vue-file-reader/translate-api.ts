import {
    type EventDescriptor,
    type ParamType,
    type PropDescriptor,
    type SlotDescriptor,
    parse,
} from "vue-docgen-api";
import { slugify } from "../../utils";
import {
    type ComponentAPI,
    type ComponentEvent,
    type ComponentModel,
    type ComponentProp,
    type ComponentSlot,
} from "./component-api";

interface PropDeprecatedTag {
    description?: string | boolean;
}

interface EventDeprecatedTag {
    content?: string | boolean;
}

function getPropSlotDeprecated(
    prop: Pick<PropDescriptor, "tags"> | Pick<SlotDescriptor, "tags">,
): string | null {
    const tags = prop.tags;
    if (!tags?.deprecated) {
        return null;
    }
    const tag = tags.deprecated[0] as PropDeprecatedTag | undefined;
    if (!tag?.description) {
        return null;
    }
    if (tag.description === true) {
        return "";
    } else {
        return tag.description;
    }
}

function getEventDeprecated(
    event: Pick<EventDescriptor, "tags">,
): string | null {
    const tags = event.tags;
    if (!tags) {
        return null;
    }
    const tag = tags.find((it) => it.title === "deprecated") as
        | EventDeprecatedTag
        | undefined;
    if (!tag?.content) {
        return null;
    }
    if (tag.content === true) {
        return "";
    } else {
        return tag.content;
    }
}

/**
 * A name is considered simple if it is suitable to type out as `Something[]`
 * instead of `Array<Something>`.
 *
 * Examples of simple names:
 *
 * - `string[]`
 * - `AwesomeInterface[]`
 *
 * Examples of complex names:
 *
 * - `Array<{ inline: "interface" }>`
 */
function isSimpleName(name: string): boolean {
    return /^[a-z0-9]+$/i.test(name);
}

/**
 * Get the type as a string from a prop.
 */
function getPropType(prop: PropDescriptor): string | null {
    const { type } = prop;
    if (!type) {
        return null;
    }

    /* for composition api the type is set to "Array" and the `elements`
     * property holds what the array contains (with a single element, if there
     * is multiple array elements it is considered a tuple). */
    if (type.name === "Array") {
        const param = type as ParamType;
        const element = param.elements?.[0];
        if (!element) {
            return "any[]";
        }
        if (isSimpleName(element.name)) {
            return `${element.name}[]`;
        } else {
            return `Array<${element.name}>`;
        }
    }

    /* similar to "Array" but this time the `elements` property contains each
     * constituent of the tuple (including zero elements if the type is `[]`) */
    if (type.name === "tuple") {
        const param = type as ParamType;
        if (!param.elements) {
            return type.name;
        }
        const constituents = param.elements.map((it) => it.name).join(", ");
        return `[${constituents}]`;
    }

    return type.name;
}

function translateProps(props: PropDescriptor[]): ComponentProp[] {
    const isRelevant = (prop: PropDescriptor): boolean => {
        return prop.tags?.ignore === undefined;
    };
    return props.filter(isRelevant).map((prop): ComponentProp => {
        const defaultValue = prop.defaultValue
            ? { value: prop.defaultValue.value }
            : null;
        return {
            name: prop.name,
            description: prop.description ?? null,
            type: getPropType(prop),
            required: Boolean(prop.required),
            default: defaultValue,
            deprecated: getPropSlotDeprecated(prop),
        };
    });
}

function translateEvents(events: EventDescriptor[]): ComponentEvent[] {
    const translatedEvents: ComponentEvent[] = [];

    for (const event of events) {
        if (event.tags?.find((it) => it.title === "ignore")) {
            continue;
        }
        const translatedEvent: ComponentEvent = {
            name: event.name,
            description: event.description ?? null,
            properties: translateEventProperties(event),
            deprecated: getEventDeprecated(event),
        };
        translatedEvents.push(translatedEvent);
    }

    return translatedEvents;
}

function translateEventProperties(event: EventDescriptor): Array<{
    name: string;
    type: string;
    description: string | null;
}> {
    const properties = event.properties;
    const types = event.type ? Object.values(event.type.names) : [];

    if (!properties && !types.length) {
        return [];
    }
    if (!properties) {
        return [
            { name: "<anonymous>", type: String(types), description: null },
        ];
    }

    const translatedProperties: Array<{
        name: string;
        type: string;
        description: string | null;
    }> = [];

    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        const name = property.name ?? "<anonymous>";
        const eventType = types[i];
        const hasEventType = Boolean(eventType) && eventType !== "undefined";
        const type = hasEventType ? eventType : property.type.names.join(" ");
        const description =
            typeof property.description === "string"
                ? property.description
                : null;

        translatedProperties.push({
            name,
            type,
            description,
        });
    }

    return translatedProperties;
}

function translateSlots(slots: SlotDescriptor[]): ComponentSlot[] {
    const translatedSlots: ComponentSlot[] = [];

    for (const slot of slots) {
        if (slot.tags?.ignore) {
            continue;
        }
        const translatedSlot: ComponentSlot = {
            name: slot.name,
            description: slot.description ?? null,
            bindings: translateSlotBindings(slot),
            deprecated: getPropSlotDeprecated(slot),
        };

        translatedSlots.push(translatedSlot);
    }

    return translatedSlots;
}

function translateSlotBindings(slot: SlotDescriptor): Array<{
    name: string;
    type: string;
    description: string | null;
}> {
    if (!slot.bindings) {
        return [];
    }

    const translatedBindings: Array<{
        name: string;
        type: string;
        description: string | null;
    }> = [];

    for (const binding of slot.bindings) {
        const name = binding.name ?? "<anonymous>";
        const type = binding.type?.name ?? "unknown";
        const description =
            typeof binding.description === "string"
                ? binding.description
                : null;
        translatedBindings.push({
            name,
            type,
            description,
        });
    }

    return translatedBindings;
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
    const modelEvents = rawEvents.filter((it) => it.name.startsWith("update:"));
    const rawModels = modelEvents.map((it) => {
        const propName = it.name.slice("update:".length);
        const prop = rawProps.find((it) => it.name === propName);
        if (!prop) {
            return null;
        }

        return {
            ...prop,
            name: propName === "modelValue" ? "v-model" : `v-model:${propName}`,
        };
    });

    const models = rawModels.filter((model) => model !== null);
    const events = rawEvents.filter((it) => !it.name.startsWith("update:"));
    const props = rawProps.filter((prop) => {
        const hasModelName = models.some(
            (model) => model.name.slice("v-model:".length) === prop.name,
        );
        return !(hasModelName || prop.name.startsWith("modelValue"));
    });

    return { models, props, events };
}

/**
 * Translates output from a vue component parser to general interface.
 * If the parser is changed the translation functions need to be updated to match its interface.
 *
 * @internal
 */
export async function translateAPI(filePath: string): Promise<ComponentAPI> {
    try {
        const api = await parse(filePath);
        const rawProps = api.props ? translateProps(api.props) : [];
        const rawEvents = api.events ? translateEvents(api.events) : [];

        const { models, props, events } = filterModels(rawProps, rawEvents);
        const slots = api.slots ? translateSlots(api.slots) : [];

        return {
            name: api.displayName,
            slug: slugify(api.displayName),
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
