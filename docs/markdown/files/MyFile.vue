<script setup>
import { ref } from "vue";

const name = ref("world");
</script>

<template>
    <div>Hello {{ name }}!</div>
</template>
