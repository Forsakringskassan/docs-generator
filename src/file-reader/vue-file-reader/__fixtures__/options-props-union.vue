<script lang="ts">
import { type PropType } from "vue";

export default {
    props: {
        types: {
            type: [String, Number] as PropType<string | number>,
            required: true,
        },
        enumeration: {
            type: String as PropType<"active" | "inactive" | "pending">,
            required: true,
        },
        complex: {
            type: Object as PropType<{ foo: "spam" } | { foo: "ham" }>,
            required: true,
        },
    },
};
</script>

<template>
    <div></div>
</template>
