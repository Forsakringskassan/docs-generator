<script setup lang="ts">
defineProps<{
    foo?: string;
    /**
     * Lorem ipsum dolor
     * sit amet.
     *
     * @param first - Index of first item.
     * @param last - Index of last item.
     */
    fetchData?(first: number, last: number): string[] | Promise<string[]>;
    bar: number;
    transform(value: string): string;
    pick?<T extends object>(items: T[], index: number): T | undefined;
    log?(
        message: string,
        level: "info" | "warn" | "error",
        source: string,
        timestamp: number,
        ...details: Array<{ key: string; value: unknown }>
    ): void;
    /**
     * @deprecated Use `transform` instead
     */
    obsolete?(): void;
}>();
</script>
