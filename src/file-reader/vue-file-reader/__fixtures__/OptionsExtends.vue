<script lang="ts">
import { defineComponent } from "vue";
import OptionsExtendsBase from "./OptionsExtendsBase.vue";

export default defineComponent({
    extends: OptionsExtendsBase,
    props: {
        decimals: {
            type: Number,
            default: 2,
        },
    },
});
</script>
