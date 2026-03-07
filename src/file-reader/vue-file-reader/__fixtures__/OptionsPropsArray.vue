<script lang="ts">
import { type PropType, defineComponent } from "vue";
import { type ExternalFoo } from "./array-interface";

interface LocalFoo {
    foo: string;
}

export default defineComponent({
    props: {
        stringArray: {
            type: Array as PropType<string[]>,
            required: true,
        },
        inlineArray: {
            type: Array as PropType<Array<{ foo: string }>>,
            required: true,
        },
        localArray: {
            type: Array as PropType<LocalFoo[]>,
            required: true,
        },
        externalArray: {
            type: Array as PropType<ExternalFoo[]>,
            required: true,
        },
        untypedArray: {
            type: Array,
            required: true,
        },
    },
});
</script>
