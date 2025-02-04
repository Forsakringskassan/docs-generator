<script setup lang="ts">
interface Props {
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
}

defineProps<Props>();
</script>
