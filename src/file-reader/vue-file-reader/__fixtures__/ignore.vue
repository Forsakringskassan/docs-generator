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

defineOptions({
    name: "IgnoreFixture",
});
</script>

<template>
    <slot name="foo"></slot>
    <!--
         @slot lorem ipsum
         @ignore
    -->
    <slot name="bar"></slot>
</template>
