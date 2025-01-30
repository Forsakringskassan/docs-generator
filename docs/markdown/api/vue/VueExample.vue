<script setup lang="ts">
defineProps({
    /**
     * Lorem ipsum dolor
     * sit amet.
     *
     * Must be one of:
     *
     * - `"a"`
     * - `"b"`
     * - `"c"`
     */
    foo: {
        type: String,
        required: false,
        default: "foobar",
    },
    /**
     * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu mollis
     * leo. Fusce eget ullamcorper augue. Aenean sodales fringilla purus, ac
     * euismod massa semper sed.
     */
    bar: {
        type: String,
        required: true,
    },
    /**
     * Lorem ipsum dolor sit amet.
     *
     * @deprecated Replaced by something else.
     */
    obsolete: {
        type: Number,
        required: false,
        default: 42,
    },
});
defineEmits<{
    /**
     * Lorem ipsum
     * dolor sit amet
     *
     * @param id - Lorem ipsum
     * @param value - Lorem ipsum
     */
    change: [id: number, value: string];
    /**
     * Lorem ipsum
     * dolor sit amet
     *
     * @param value - Lorem ipsum
     */
    update: [value: string];
    /**
     * Lorem ipsum dolor sit amet
     *
     * @deprecated Will be gone later.
     * @param value - Lorem ipsum
     */
    obsolete: [value: string];
}>();
</script>

<template>
    <!-- @slot Lorem ipsum dolor sit amet -->
    <slot name="default"></slot>

    <!--
         @slot Lorem ipsum dolor sit amet
         @binding {number} foo Lorem ipsum dolor sit amet
         @binding {number} bar Lorem ipsum dolor sit amet
    -->
    <slot name="foo" v-bind="{ foo: 1, bar: 2, baz: 'spam' }"></slot>

    <!--
         @slot Lorem ipsum dolor sit amet.
         @deprecated Use another slot instead.
    -->
    <slot name="obsolete"></slot>
</template>
