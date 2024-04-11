/** @public */
export type AttributeValue =
    | string
    | number
    | boolean
    | null
    | { [key: string]: AttributeValue };

/** @public */
export type AttributeTable = Record<string, AttributeValue>;

function quote(text: string | number): string {
    return String(text).replace(/"/g, "&quot;");
}

function* serializeAttr(key: string, value: AttributeValue): Generator<string> {
    if (value === null || value === false) {
        return;
    }
    if (value === true) {
        yield key;
        return;
    }
    if (typeof value === "string" || typeof value === "number") {
        yield `${key}="${quote(value)}"`;
        return;
    }
    for (const [innerKey, innerValue] of Object.entries(value)) {
        yield* serializeAttr([key, innerKey].join("-"), innerValue);
    }
}

export function* serializeAttrs(attrs: AttributeTable): Generator<string> {
    for (const [key, value] of Object.entries(attrs)) {
        yield* serializeAttr(key, value);
    }
}
