/**
 * Executes callback when DOM is ready. If DOM is already ready the callback is
 * executed during the next cycle.
 *
 * @public
 */
export function onContentReady(callback: () => void): void {
    const { readyState } = document;
    if (readyState === "complete" || readyState === "interactive") {
        queueMicrotask(callback);
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}
