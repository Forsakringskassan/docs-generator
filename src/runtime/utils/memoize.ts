function cacheKey(...args: unknown[]): string {
    return JSON.stringify(args);
}

/**
 * Creates a new lazy-evaluated and cached function.
 *
 * The result of the callback will be cached once evaluated and subsequent calls
 * will return the cached value. When passing a callback with parameters each
 * set of arguments are cached individually. The parameters must be serializable
 * to string.
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
 *
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
export function memoize<TReturn, TArgs extends unknown[]>(
    callback: (...args: TArgs) => Promise<TReturn>,
): (...args: TArgs) => Promise<TReturn>;
export function memoize<TReturn, TArgs extends unknown[]>(
    callback: (...args: TArgs) => TReturn,
): (...args: TArgs) => TReturn;
export function memoize(
    callback: (...args: unknown[]) => unknown | Promise<unknown>,
): (...args: unknown[]) => unknown | Promise<unknown> {
    const cache = new Map<string, unknown | Promise<unknown>>();
    return (...args: unknown[]) => {
        const key = cacheKey(args);
        if (!cache.has(key)) {
            cache.set(key, callback(...args));
        }
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- at this point we know the key will exist */
        return cache.get(key)!;
    };
}
