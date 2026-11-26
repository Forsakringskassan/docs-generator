import { SoftError } from "../soft-error";
import { type InlineTag } from "./inline-tag";

/**
 * @internal
 */

export function variableTag(templateData: Record<string, unknown>): InlineTag {
    return {
        name: "variable",
        description: "Insert a template variable value",
        handler(_doc, _docs, content) {
            const key = content.trim();
            if (!key || /\s/.test(key)) {
                throw new SoftError(
                    "EVARIABLEFORMAT",
                    `Failed to parse variable "${content}"`,
                );
            }

            const value = templateData[key];
            if (value === undefined || value === null) {
                throw new SoftError(
                    "EVARIABLETARGET",
                    `Failed to find template variable "${key}"`,
                    { key },
                );
            }

            if (typeof value === "string" || typeof value === "number") {
                return String(value);
            }

            return JSON.stringify(value);
        },
    };
}
