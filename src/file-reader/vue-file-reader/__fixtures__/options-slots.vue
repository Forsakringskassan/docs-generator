<script lang="ts">
import { type SlotsType, defineComponent } from "vue";

export default defineComponent({
    name: "FooBar",
    props: {},
    slots: Object as SlotsType<{
        /**
         * Lorem default ipsum
         */
        default?(): unknown;

        /**
         * Lorem foo ipsum
         */
        foo(props: {
            /**
             * Item description
             */
            item: string;

            /**
             * Index description
             */
            index: number;
        }): unknown;

        bar?(): unknown;
    }>,
});
</script>

<template>
    <!--
        @slot Lorem default ipsum
    -->
    <slot name="default"></slot>

    <!--
        @slot Lorem foo ipsum
        @binding {string} item - Item description
        @binding {number} index - Index description
    -->
    <slot name="foo" item="foo" :index="1"></slot>

    <slot name="bar"></slot>
</template>
