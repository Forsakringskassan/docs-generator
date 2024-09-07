<template>
    <div>Hello {{ name }}!</div>
</template>

<script setup>
import { ref } from "vue";

const name = ref("world");
</script>
