/**
 * Wait for a keypress and return the pressed key.
 *
 * @internal
 */
export async function keypress(): Promise<string> {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    return new Promise((resolve) => {
        process.stdin.once("data", (data) => {
            process.stdin.setRawMode(false);
            process.stdin.resume();
            resolve(data.toString("utf-8"));
        });
    });
}
