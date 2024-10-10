<script setup lang="ts">
import { type PropType } from "vue";

defineProps({
    /* eslint-disable-next-line vue/require-default-prop -- ensuring the tool handles this */
    foo: String,
    bar: {
        type: Number,
        required: true,
    },
    /**
     * Lorem ipsum dolor
     * sit amet.
     */
    baz: {
        type: Object as PropType<{ name: string }>,
        required: false,
        default() {
            return { name: "" };
        },
    },
});
</script>
