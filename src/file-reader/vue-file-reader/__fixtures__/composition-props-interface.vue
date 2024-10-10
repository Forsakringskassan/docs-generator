<script setup lang="ts">
interface Props {
    foo?: string;
    bar: number;
    /**
     * Lorem ipsum dolor
     * sit amet.
     */
    baz?: { name: string };
}

defineProps<Props>();
</script>
