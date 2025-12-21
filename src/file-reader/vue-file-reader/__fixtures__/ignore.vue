<script setup lang="ts">
defineProps({
    foo: {
        type: String,
        required: true,
    },
    /**
     * @ignore
     */
    bar: {
        type: String,
        required: true,
    },
});

defineEmits<{
    foo: [];

    /**
     * @ignore
     */
    bar: [];
}>();

defineSlots<{
    foo(): void;

    /**
     * @ignore
     */
    bar(): void;
}>();

defineOptions({
    name: "IgnoreFixture",
});
</script>

<template>
    <slot name="foo"></slot>
    <slot name="bar"></slot>
</template>
