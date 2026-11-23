<script setup lang="ts">
interface Item {
    name: string;
}

defineProps<{
    field: keyof Item;
    format?: Intl.DateTimeFormatOptions;
    name: Item["name"];
}>();
</script>
