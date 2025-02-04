<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    emits: [
        "foo",
        /**
         * dolor sit amet
         */
        "bar",
        /**
         * @deprecated Use `foo` instead
         */
        "obsolete",
    ],

    methods: {
        onFoo() {
            /**
             * Lorem ipsum
             */
            this.$emit("foo");
        },
    },
});
</script>
