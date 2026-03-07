<script lang="ts">
import { type PropType, defineComponent } from "vue";

export default defineComponent({
    props: {
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
        /**
         * @deprecated Use `foo` instead
         */
        obsolete: {
            type: String,
            default: "",
        },
    },
});
</script>
