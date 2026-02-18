<script setup lang="ts">
interface Props {
    /* eslint-disable-next-line vue/require-default-prop -- ensuring the tool handles this */
    foo?: string;
    bar: number;
    /**
     * Lorem ipsum dolor
     * sit amet.
     */
    baz?: number;
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- ignore unused for this testcase */
const { foo, bar, baz = 42 } = defineProps<Props>();
</script>
