<script setup lang="ts">
const items: string[] = [];
const numberOfItems: number = items.length;
</script>

<template>
    <!--
        @slot Slot for the page.
        @binding {string[]} items The items on the current page.
    -->
    <slot name="default" v-bind="{ items, numberOfItems }"></slot>
</template>
