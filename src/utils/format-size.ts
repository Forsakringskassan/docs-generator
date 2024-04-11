export function formatSize(value: number): string {
    const suffices = ["kB", "MB"];
    if (value < 1000) {
        return `${value}`;
    }
    for (const suffix of suffices) {
        value = Math.round((value / 1000) * 100) / 100;
        if (value < 1000) {
            return `${value} ${suffix}`;
        }
    }
    value = Math.round((value / 1000) * 100) / 100;
    return `${value} GB`;
}
