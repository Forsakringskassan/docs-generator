/**
 * @internal
 */
export function* zip<T, U>(
    a: T[] | IterableIterator<T, void>,
    b: U[] | IterableIterator<U, void>,
): Generator<[T, U], void> {
    const ia = Array.isArray(a) ? a.values() : a;
    const ib = Array.isArray(b) ? b.values() : b;
    for (;;) {
        const va = ia.next();
        const vb = ib.next();
        if (va.done || vb.done) {
            return;
        }
        yield [va.value, vb.value];
    }
}
