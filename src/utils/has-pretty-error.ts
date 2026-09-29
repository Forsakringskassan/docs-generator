/**
 * An error that provides a human-friendly formatted message.
 *
 * @public
 * @since %version%
 */
export interface PrettyError {
    prettyError(): string;
}

/**
 * Tell if an error exposes a `prettyError()` method for human-friendly output.
 *
 * @public
 * @since %version%
 */
export function hasPrettyError(value: unknown): value is PrettyError {
    if (!value) {
        return false;
    }
    if (typeof value !== "object") {
        return false;
    }
    return "prettyError" in value && typeof value.prettyError === "function";
}
