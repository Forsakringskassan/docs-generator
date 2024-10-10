<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    emits: {
        /**
         * Lorem ipsum
         *
         * @param name - dolor sit amet
         */
        foo(name: string): boolean {
            return name !== "";
        },
        bar() {
            return true;
        },
    },
});
</script>
