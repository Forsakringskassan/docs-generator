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
         * Emitted on change.
         *
         * @arg {string} value - The new value.
         */
        "change",
        "update:modelValue",
    ],
});
</script>

<template>
    <!-- @slot Label content -->
    <slot></slot>
    <slot name="icon" :size="16"></slot>
</template>
