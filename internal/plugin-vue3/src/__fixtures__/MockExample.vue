<template>
    <p class="greeting">Hello {{ name }}!</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "MockExample",
    props: {
        name: {
            type: String,
            required: true,
        },
    },
});
</script>

<style>
.greeting {
    color: red;
}
</style>
