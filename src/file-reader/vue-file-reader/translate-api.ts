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

const EMPTY_CHAR = "&#8208;";
const EM_DASH = "&#8212;";

function translateProps(props: PropDescriptor[]): ComponentProp[] {
    const translatedProps: ComponentProp[] = [];

    for (const prop of props) {
        const translatedProp = {
            name: prop.name,
            description: prop.description ?? EMPTY_CHAR,
            type: prop.type?.name ?? EMPTY_CHAR,
            required: prop.required ? "true" : "false",
            default: prop.defaultValue?.value ?? EMPTY_CHAR,
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
        const translatedSlot = {
            name: slot.name,
            description: slot.description ?? EMPTY_CHAR,
            bindings: translateSlotBindings(slot),
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
        translatedBindings.push(binding.name ? binding.name : EMPTY_CHAR);
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

    return {
        props,
        events,
        slots,
    };
}
