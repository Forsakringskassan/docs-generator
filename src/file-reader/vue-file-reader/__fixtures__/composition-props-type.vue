<script setup lang="ts">
defineProps<{
    foo?: string;
    bar: number;
    /**
     * Lorem ipsum dolor
     * sit amet.
     */
    baz?: { name: string };
    /**
     * @deprecated Use `foo` instead
     */
    obsolete?: string;
}>();
</script>
