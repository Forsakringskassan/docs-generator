<script setup lang="ts">
defineProps({
    /**
     * Lorem ipsum.
     */
    modelValue: {
        type: String,
        default: "",
    },
});

defineEmits<{
    "update:modelValue": [value: string];
}>();
</script>
