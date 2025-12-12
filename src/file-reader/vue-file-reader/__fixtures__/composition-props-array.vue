<script setup lang="ts">
import { ExternalFoo } from "./array-interface";

interface LocalFoo {
    foo: string;
}

defineProps<{
    stringArray: string[];
    inlineArray: Array<{ foo: string }>;
    localArray: LocalFoo[];
    externalArray: ExternalFoo[];

    /* eslint-disable-next-line @typescript-eslint/array-type -- discouraged but should work */
    untypedArray: Array;
}>();
</script>
