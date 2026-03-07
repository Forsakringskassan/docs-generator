<script setup lang="ts">
interface Emits {
    /**
     * Lorem ipsum
     *
     * @param name - dolor sit amet
     */
    (e: "foo", name: string): void;
    (e: "bar"): void;
    /**
     * @deprecated Use `foo` instead
     */
    /* eslint-disable-next-line @typescript-eslint/unified-signatures -- testcase, should literally do this */
    (e: "obsolete"): void;
}

defineEmits<Emits>();
</script>
