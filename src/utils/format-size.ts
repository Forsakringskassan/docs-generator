export function formatSize(value: number): string {
    const suffices = ["kB", "MB"];
    if (value < 1000) {
        return String(value);
    }
    for (const suffix of suffices) {
        value = Math.round((value / 1000) * 100) / 100;
        if (value < 1000) {
            return `${String(value)} ${suffix}`;
        }
    }
    value = Math.round((value / 1000) * 100) / 100;
    return `${String(value)} GB`;
}
