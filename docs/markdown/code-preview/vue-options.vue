<template>
    <p>
        Hello <em>{{ name }}!</em>
    </p>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            name: "World",
        };
    },
});
</script>

<style scoped>
p {
    margin: 0;
}
em {
    color: red;
    font-style: normal;
}
</style>
