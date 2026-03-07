<script setup lang="ts">
/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- for testing only */
const enumeration = ["foo", "bar", "baz"] as const;

/* eslint-disable-next-line vue/define-macros-order -- enumeration has to be defined before defineProps */
defineProps<{
    value: (typeof enumeration)[number];
}>();
</script>
