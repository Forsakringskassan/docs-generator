<script setup lang="ts">
withDefaults(
    defineProps<{
        foo?: string;
        /**
         * Lorem ipsum.
         */
        sort?(items: string[]): string[];
    }>(),
    {
        foo: "default",
        sort: (items: string[]) => items,
    },
);
</script>
