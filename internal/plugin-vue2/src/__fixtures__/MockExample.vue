<template>
    <p class="greeting">Hello {{ name }}!</p>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
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
