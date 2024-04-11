export function difference<T>(a: Set<T>, b: Set<T>): Set<T> {
    const _difference = new Set(a);
    for (const elem of b) {
        _difference.delete(elem);
    }
    return _difference;
}
