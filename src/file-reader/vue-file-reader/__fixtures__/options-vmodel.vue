<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        /**
         * Lorem ipsum.
         *
         * @model
         */
        modelValue: {
            type: String,
            default: "",
        },
    },
});
</script>
