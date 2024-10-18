<template>
    <live-example :template="myTemplate" :examples> </live-example>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LiveExample, type LiveExampleVariant } from "@forsakringskassan/docs-live-example";
import optionsApiRaw from "./multiple-script/OptionsApiLiveExample.vue?raw";
import optionsApi from "./multiple-script/OptionsApiLiveExample.vue";
import compositionApiRaw from "./multiple-script/ConpositionApiLiveExample.vue?raw";
import compositionApi from "./multiple-script/ConpositionApiLiveExample.vue";

export default defineComponent({
    name: "HTMLLiveExample",
    components: { LiveExample },
    data() {
        return {
            myTemplate: `<span>Hello {{ myName }}!</span> `,
            examples: [
                {
                    displayName: "Vue - Options API",
                    scriptMarkdown: optionsApiRaw,
                    component: optionsApi,
                    language: "vue",
                },
                {
                    displayName: "Vue - Composition API",
                    scriptMarkdown: compositionApiRaw,
                    component: compositionApi,
                    language: "vue",
                },
            ] as LiveExampleVariant[],
        };
    },
});
</script>
