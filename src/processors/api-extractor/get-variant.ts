const available = {
    interface: ["default", "interface", "properties"],
    function: ["default", "prototype", "parameters", "returnvalue", "docs"],
} as const;

type MappedType = typeof available;
type MappedKeys = keyof MappedType;
type MappedTag<K extends MappedKeys> = MappedType[K][number];

/**
 * Get variant from tags.
 *
 * @internal
 */
export function getVariant<K extends MappedKeys>(
    kind: K,
    tags: string[],
): MappedTag<K>;
export function getVariant(kind: MappedKeys, tags: string[]): string {
    const variant = available[kind].find((it) => tags.includes(it));
    return variant ?? "default";
}
