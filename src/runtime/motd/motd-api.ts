import { type MOTDMessage } from "./motd-message";

/**
 * @public
 */
export interface MOTDApi {
    readonly enabled: boolean;
    showMessage(message: MOTDMessage): void;
}
