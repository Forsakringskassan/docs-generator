<script setup lang="ts">
defineSlots<{
    /**
     * Lorem default ipsum
     */
    default(): unknown;

    /**
     * Lorem foo ipsum
     */
    foo(props: {
        /**
         * Item description
         */
        item: string;

        /**
         * Index description
         */
        index: number;
    }): unknown;

    bar(): unknown;
}>();
</script>

<template>
    <slot></slot>
    <slot name="foo" item="foo" :index="1"></slot>
    <slot name="bar"></slot>
</template>
