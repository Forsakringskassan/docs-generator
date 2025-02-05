import {
    type PropDescriptor,
    type SlotDescriptor,
    type EventDescriptor,
    parse,
} from "vue-docgen-api";
import {
    type ComponentAPI,
    type ComponentProp,
    type ComponentSlot,
    type ComponentEvent,
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
    if (!tags) {
        return null;
    }
    const tag = tags["deprecated"]?.[0] as PropDeprecatedTag | undefined;
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
        return "true";
    } else {
        return tag.content;
    }
}

function translateProps(props: PropDescriptor[]): ComponentProp[] {
    return props.map((prop): ComponentProp => {
        const defaultValue = prop.defaultValue
            ? { value: prop.defaultValue.value }
            : null;
        return {
            name: prop.name,
            description: prop.description ?? null,
            type: prop.type?.name ?? null,
            required: Boolean(prop.required),
            default: defaultValue,
            deprecated: getPropSlotDeprecated(prop),
        };
    });
}

function translateEvents(events: EventDescriptor[]): ComponentEvent[] {
    const translatedEvents: ComponentEvent[] = [];

    for (const event of events) {
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
        const hasEventType = !eventType || eventType !== "undefined";
        const type = hasEventType ? eventType : String(property.type.names);
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
