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
    emits: ["update:modelValue"],
});
</script>
