<template>
    <live-example language="vue" :template :livedata>
        <label class="docs-block" for="html-name"> Name </label>
        <select id="html-name" v-model="name" class="docs-block" name="html-name">
            <option value="predefined">Predefined</option>
            <option value="custom">Custom</option>
        </select>
    </live-example>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LiveExample } from "@forsakringskassan/docs-live-example";

export default defineComponent({
    name: "VueLiveExample",
    components: { LiveExample },
    data() {
        return {
            name: "predefined",
        };
    },
    computed: {
        livedata(): unknown {
            const useCustomName = this.name === "custom";
            return {
                name: "World",
                useCustomName,
            };
        },
        template(): string {
            return /* HTML */ `
                <p>Hello {{ name }}!</p>
                <template v-if="useCustomName">
                    <label>Name: <input type="text" v-model="name" /></label>
                </template>
            `;
        },
    },
});
</script>
