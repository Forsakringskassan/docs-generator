export interface ComponentAPI {
    props: ComponentProp[];
    slots: ComponentSlot[];
    events: ComponentEvent[];
}

export interface ComponentProp {
    name: string;
    description: string;
    type: string;
    required: string;
    default: string;
}

export interface ComponentSlot {
    name: string;
    description: string;
    bindings: string;
}

export interface ComponentEvent {
    name: string;
    description: string;
    properties: string;
}
