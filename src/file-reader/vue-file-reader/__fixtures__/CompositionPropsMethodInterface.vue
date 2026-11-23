<script setup lang="ts">
interface BaseProps {
    /**
     * Lorem ipsum.
     */
    onSelect?(id: string): void;
}

interface Props extends BaseProps {
    id: string;
    format(id: string): string;
}

defineProps<Props>();
</script>
