<script setup lang="ts">
/* eslint-disable @typescript-eslint/unified-signatures -- testcase, should literally do this */

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
    (e: "obsolete"): void;
}

defineEmits<Emits>();
</script>
