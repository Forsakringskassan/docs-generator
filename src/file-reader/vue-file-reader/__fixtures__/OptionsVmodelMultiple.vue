<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        /**
         * Lorem ipsum.
         */
        modelValue: {
            type: String,
            default: "",
        },
        foo: {
            type: Number,
            default: 0,
        },
    },
    emits: ["update:modelValue", "update:foo"],
});
</script>
