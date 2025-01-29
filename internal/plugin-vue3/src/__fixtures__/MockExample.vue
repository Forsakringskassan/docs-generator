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

<template>
    <p class="greeting">Hello {{ name }}!</p>
</template>

<style>
.greeting {
    color: red;
}
</style>
