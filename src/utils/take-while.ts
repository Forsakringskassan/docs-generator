/**
 * @internal
 */
export function* takeWhile<T>(
    it: T[] | IterableIterator<T>,
    predicate: (value: T) => boolean,
): Generator<T, void> {
    for (const value of it) {
        if (!predicate(value)) {
            return;
        }
        yield value;
    }
}
