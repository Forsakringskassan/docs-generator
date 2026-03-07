<script lang="ts">
import { defineComponent } from "vue";
import { LiveExample } from "@forsakringskassan/docs-live-example";

export default defineComponent({
    name: "HTMLLiveExample",
    components: { LiveExample },
    data() {
        return {
            name: "World",
        };
    },
    computed: {
        template(): string {
            return /* HTML */ ` <div>Hello ${this.name}!</div> `;
        },
    },
});
</script>

<template>
    <live-example language="html" :template>
        <label class="docs-block" for="html-name"> Name </label>
        <select id="html-name" v-model="name" class="docs-block" name="html-name">
            <option value="World">World</option>
            <option value="Kalle Anka">Kalle Anka</option>
            <option value="Fred Flintstone">Fred Flintstone</option>
        </select>
    </live-example>
</template>
