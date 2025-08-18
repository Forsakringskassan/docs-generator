/**
 * @internal
 */
export interface ComponentAPI {
    readonly name: string;
    readonly slug: string;
    readonly models: ComponentModel[];
    readonly props: ComponentProp[];
    readonly slots: ComponentSlot[];
    readonly events: ComponentEvent[];
}

/**
 * @internal
 */
export interface ComponentModel {
    name: string;
    readonly description: string | null;
    readonly type: string | null;
    readonly required: boolean;
    readonly default: { value: string } | null;
    readonly deprecated: string | null;
}

/**
 * @internal
 */
export interface ComponentProp {
    name: string;
    readonly description: string | null;
    readonly type: string | null;
    readonly required: boolean;
    readonly default: { value: string } | null;
    readonly deprecated: string | null;
}

export interface ComponentSlot {
    readonly name: string;
    readonly description: string | null;
    readonly bindings: Array<{
        name: string;
        type: string;
        description: string | null;
    }>;
    readonly deprecated: string | null;
}

export interface ComponentEvent {
    readonly name: string;
    readonly description: string | null;
    readonly properties: Array<{
        name: string;
        type: string;
        description: string | null;
    }>;
    readonly deprecated: string | null;
}
