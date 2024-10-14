<script setup lang="ts">
defineEmits<{
    /**
     * Lorem ipsum
     *
     * @param name - dolor sit amet
     */
    (e: "foo", name: string): void;
    (e: "bar"): void;
}>();
</script>
