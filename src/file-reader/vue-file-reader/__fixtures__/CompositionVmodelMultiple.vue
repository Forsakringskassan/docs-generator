<script setup lang="ts">
defineProps({
    /**
     * Lorem ipsum.
     */
    modelValue: {
        type: String,
        default: "",
    },
    foo: {
        type: Number,
        default: 0,
    },
});

defineEmits<{
    "update:modelValue": [value: string];
    "update:foo": [value: number];
}>();
</script>
