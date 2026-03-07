<script lang="ts">
import { type PropType, defineComponent } from "vue";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- for testing only */
const enumeration = ["foo", "bar", "baz"] as const;

export default defineComponent({
    props: {
        value: {
            type: String as PropType<(typeof enumeration)[number]>,
            required: true,
        },
    },
});
</script>
