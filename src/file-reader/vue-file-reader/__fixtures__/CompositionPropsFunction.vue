<script setup lang="ts">
defineProps<{
    /**
     * Lorem ipsum.
     */
    rowClass?: (row: number) => string;
    label: string | ((row: number) => string);
    callbacks?: Array<() => void>;
}>();
</script>
