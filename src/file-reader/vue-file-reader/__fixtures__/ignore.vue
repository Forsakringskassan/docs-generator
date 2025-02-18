<script setup lang="ts">
defineOptions({
    name: "IgnoreFixture",
});

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
</script>

<template>
    <slot name="foo"></slot>
    <!--
         @slot lorem ipsum
         @ignore
    -->
    <slot name="bar"></slot>
</template>
