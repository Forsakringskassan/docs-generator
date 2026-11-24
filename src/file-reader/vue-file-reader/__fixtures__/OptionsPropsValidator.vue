<script lang="ts">
import { defineComponent } from "vue";

const ALIGNMENT = ["top", "bottom"] as const;

export default defineComponent({
    props: {
        headerTag: {
            type: String,
            default: "h2",
            validator(value: string): boolean {
                return ["h1", "h2"].includes(value);
            },
        },
        align: {
            type: String,
            default: "top",
            validator: (value: string) => (ALIGNMENT as readonly string[]).includes(value),
        },
    },
});
</script>
