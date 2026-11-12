function isBusyError(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "EBUSY"
    );
}

/**
 * Runs the given function and retries it if it fails with `EBUSY`. Files can be
 * temporarily locked on Windows by e.g. antivirus software or file watchers.
 *
 * @internal
 */
export async function retryOnBusy<T>(
    fn: () => Promise<T>,
    options: { attempts?: number; delay?: number } = {},
): Promise<T> {
    const { attempts = 5, delay = 50 } = options;
    for (let attempt = 1; ; attempt++) {
        try {
            return await fn();
        } catch (error: unknown) {
            if (!isBusyError(error) || attempt >= attempts) {
                throw error;
            }
            await new Promise((resolve) =>
                setTimeout(resolve, delay * attempt),
            );
        }
    }
}
