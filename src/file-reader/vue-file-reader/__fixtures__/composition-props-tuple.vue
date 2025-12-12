<script setup lang="ts">
defineProps<{
    emptyTuple: [];
    singleElementTuple: [foo: number];
    multipleElementTuple: [foo: string, bar: number];
}>();
</script>
