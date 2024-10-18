<script setup>
import { ref } from "vue";

const name = ref("World");
</script>

<template>
    <p>
        Hello <em>{{ name }}!</em>
    </p>
</template>

<style scoped>
p {
    margin: 0;
}
em {
    color: red;
    font-style: normal;
}
</style>
