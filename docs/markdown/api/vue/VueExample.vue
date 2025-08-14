<script setup lang="ts">
function $t(_key: string, defaultText: string, _params: Record<string, unknown>): string {
    return defaultText;
}

defineProps({
    /**
     * Lorem ipsum dolor
     * sit amet.
     */
    modelValue: {
        type: String,
        required: false,
        default: "",
    },
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
    "update:modelValue": [value: string];
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

const text = $t("translation.key.foo", "foo default text");
</script>

<template>
    <p>{{ text }}</p>
    <p>
        {{
            /** something something... */
            $t("translation.key.bar", "bar default text", {
                /** A thingamajig */
                foo: 1,
                /** A doodad */
                bar: "baz",
            })
        }}
    </p>

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
