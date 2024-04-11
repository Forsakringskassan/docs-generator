import { type AddressInfo } from "net";

/**
 * @internal
 */
export function printMenu(addr: AddressInfo): void {
    /* eslint-disable no-console -- expected to log */
    console.log();
    console.group(
        `Starting development server at http://localhost:${addr.port}`,
    );
    console.log();
    console.log("[q] quit");
    console.log();
    console.groupEnd();
    /* eslint-enable no-console */
}
