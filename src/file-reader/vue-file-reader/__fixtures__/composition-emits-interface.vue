<script setup lang="ts">
interface Emits {
    /**
     * Lorem ipsum
     *
     * @param name - dolor sit amet
     */
    (e: "foo", name: string): void;
    (e: "bar"): void;
}

defineEmits<Emits>();
</script>
