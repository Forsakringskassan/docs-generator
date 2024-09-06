/**
 * Creates a new lazy-evaluated and cached function.
 *
 * Note: currently does not accept arguments.
 *
 * @example
 *
 * Usage functional style:
 *
 * ```ts
 * function expensiveCalculation() {
 *     // ...
 * }
 *
 * const fn = memoize(expensiveCalculation);
 *
 * // compute the value
 * const result1 = fn();
 *
 * // subsequent calls will be cached
 * // i.e. result1 === result2
 * const result2 = fn();
 * ```
 *
 * Usage as a decorator:
 *
 * ```ts
 * class AwesomeClass {
 *     @memoize
 *     public expensiveCalculation() {
 *         // ...
 *     }
 * }
 *
 * // compute the value
 * const instance = new AwesomeClass();
 * const result1 = instance.expensiveCalculation();
 *
 * // subsequent calls will be cached
 * // i.e. result1 === result2
 * const result2 = instance.expensiveCalculation();
 * ```
 *
 * @internal
 * @param callback - The expensive callback to be memoized.
 * @returns A wrapped function.
 */
export function memoize<T>(callback: () => Promise<T>): () => Promise<T>;
export function memoize<T>(callback: () => T): () => T;
export function memoize(
    callback: () => unknown | Promise<unknown>,
): () => unknown | Promise<unknown> {
    let cache: unknown | Promise<unknown>;
    let ready = false;
    return () => {
        if (!ready) {
            cache = callback();
            ready = true;
        }
        return cache;
    };
}
