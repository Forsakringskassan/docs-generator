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
    },
    emits: [
        /**
         * Emitted when the value changes.
         *
         * @type {string | string[]}
         */
        "change",
        /**
         * V-model event.
         */
        "update:modelValue",
    ],
});
</script>
