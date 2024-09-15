/**
 * @public
 */
export interface MOTDMessage {
    /** Text message (may include HTML) */
    message: string;

    /** ID of message template to use */
    template?: string;

    /** Optional extra bindings */
    bindings?: Record<string, string>;

    /** Called with the new DOM element before the element is shown */
    preprocess?(element: DocumentFragment): void;
}
