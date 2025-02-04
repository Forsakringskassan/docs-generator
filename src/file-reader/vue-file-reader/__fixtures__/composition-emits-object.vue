<script setup lang="ts">
defineEmits({
    /**
     * Lorem ipsum
     *
     * @param name - dolor sit amet
     */
    foo(name: string): boolean {
        return name !== "";
    },
    bar() {
        return true;
    },
    /**
     * @deprecated Use `foo` instead
     */
    obsolete() {
        return true;
    },
});
</script>
