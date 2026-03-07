<script setup lang="ts">
interface Props {
    /* eslint-disable-next-line vue/require-default-prop -- ensuring the tool handles this */
    foo?: string;
    bar: number;
    /**
     * Lorem ipsum dolor
     * sit amet.
     */
    baz?: { name: string };
}

withDefaults(defineProps<Props>(), {
    baz: () => {
        return { name: "" };
    },
});
</script>
