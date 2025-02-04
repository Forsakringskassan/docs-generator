import {
    PropDescriptor,
    SlotDescriptor,
    EventDescriptor,
    parse,
} from "vue-docgen-api";
import {
    ComponentAPI,
    ComponentProp,
    ComponentSlot,
    ComponentEvent,
} from "./component-api";

interface PropDeprecatedTag {
    description?: string | boolean;
}

interface EventDeprecatedTag {
    content?: string | boolean;
}

const EMPTY_CHAR = "&#8208;";
const EM_DASH = "&#8212;";

function getPropSlotDeprecated(
    prop: Pick<PropDescriptor, "tags"> | Pick<SlotDescriptor, "tags">,
): string {
    const tags = prop.tags;
    if (!tags) {
        return EMPTY_CHAR;
    }
    const tag = tags["deprecated"]?.[0] as PropDeprecatedTag | undefined;
    if (!tag?.description) {
        return EMPTY_CHAR;
    }
    if (tag.description === true) {
        return "true";
    } else {
        return tag.description;
    }
}

function getEventDeprecated(event: Pick<EventDescriptor, "tags">): string {
    const tags = event.tags;
    if (!tags) {
        return EMPTY_CHAR;
    }
    const tag = tags.find((it) => it.title === "deprecated") as
        | EventDeprecatedTag
        | undefined;
    if (!tag?.content) {
        return EMPTY_CHAR;
    }
    if (tag.content === true) {
        return "true";
    } else {
        return tag.content;
    }
}

function translateProps(props: PropDescriptor[]): ComponentProp[] {
    const translatedProps: ComponentProp[] = [];

    for (const prop of props) {
        const translatedProp: ComponentProp = {
            name: prop.name,
            description: prop.description ?? EMPTY_CHAR,
            type: prop.type?.name ?? EMPTY_CHAR,
            required: prop.required ? "true" : "false",
            default: prop.defaultValue?.value ?? EMPTY_CHAR,
            deprecated: getPropSlotDeprecated(prop),
        };

        translatedProps.push(translatedProp);
    }

    return translatedProps;
}

function translateEvents(events: EventDescriptor[]): ComponentEvent[] {
    const translatedEvents: ComponentEvent[] = [];

    for (const event of events) {
        const translatedEvent: ComponentEvent = {
            name: event.name,
            description: event.description ?? EMPTY_CHAR,
            properties: translateEventProperties(event),
            deprecated: getEventDeprecated(event),
        };
        translatedEvents.push(translatedEvent);
    }

    return translatedEvents;
}

function translateEventProperties(event: EventDescriptor): string {
    const properties = event.properties;
    const types = event.type ? Object.values(event.type.names) : [];

    if (!properties && !types.length) {
        return EMPTY_CHAR;
    }
    if (!properties) {
        return `<anonymous>: ${String(types)}`;
    }

    const translatedProperties: string[] = [];

    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        const name = property.name ?? "<anonymous>";

        const eventType = types[i];
        const hasEventType = !eventType || eventType !== "undefined";
        const resolvedType = hasEventType
            ? eventType
            : String(property.type.names);
        const type = `: ${resolvedType}`;

        const description = property.description
            ? ` ${EM_DASH} ${property.description}`
            : "";

        translatedProperties.push(`${name}${type}${description}`);
    }

    return translatedProperties.join("\n");
}

function translateSlots(slots: SlotDescriptor[]): ComponentSlot[] {
    const translatedSlots: ComponentSlot[] = [];

    for (const slot of slots) {
        const translatedSlot: ComponentSlot = {
            name: slot.name,
            description: slot.description ?? EMPTY_CHAR,
            bindings: translateSlotBindings(slot),
            deprecated: getPropSlotDeprecated(slot),
        };

        translatedSlots.push(translatedSlot);
    }

    return translatedSlots;
}

function translateSlotBindings(slot: SlotDescriptor): string {
    if (!slot.bindings) {
        return EMPTY_CHAR;
    }

    const translatedBindings = [];

    for (const binding of slot.bindings) {
        const name = binding.name ?? EMPTY_CHAR;
        const type = binding.type ? `: ${binding.type.name}` : "";
        const description = binding.description
            ? ` ${EM_DASH} ${binding.description}`
            : "";
        translatedBindings.push(`${name}${type}${description}`);
    }

    return translatedBindings.join("\n");
}

/**
 * Translates output from a vue component parser to general interface.
 * If the parser is changed the translation functions need to be updated to match its interface.
 *
 * @internal
 */
export async function translateAPI(filePath: string): Promise<ComponentAPI> {
    const api = await parse(filePath);
    const props = api.props ? translateProps(api.props) : [];
    const events = api.events ? translateEvents(api.events) : [];
    const slots = api.slots ? translateSlots(api.slots) : [];

    /* remap v-model props */
    for (const event of events) {
        if (!event.name.startsWith("update:")) {
            continue;
        }
        const prop = event.name.slice("update:".length);
        const entry = props.find((it) => it.name === prop);
        if (entry) {
            entry.name = prop === "modelValue" ? "v-model" : `v-model:${prop}`;
        }
    }

    return {
        props,
        events,
        slots,
    };
}
