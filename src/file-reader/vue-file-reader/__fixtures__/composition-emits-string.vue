<script setup lang="ts">
defineEmits([
    /** Lorem ipsum */
    "foo",
    "bar",
    /**
     * @deprecated Use `foo` instead
     */
    "obsolete",
]);
</script>
