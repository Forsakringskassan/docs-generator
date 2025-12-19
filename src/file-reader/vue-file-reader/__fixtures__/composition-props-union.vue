<script setup lang="ts">
defineProps<{
    types: string | number;
    enumeration: "active" | "inactive" | "pending";
    complex: { foo: "spam" } | { foo: "ham" };
}>();
</script>
