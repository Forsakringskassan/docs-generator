<script setup lang="ts" generic="T">
/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- ignore unused for this testcase */
const { items = [], fetchData = () => null } = defineProps<{
    /**
     * The items to display.
     */
    items?: T[];

    /**
     * The function for fetching data when switching pages.
     *
     * @param firstItemIndex - The index of the first item on the page.
     * @param lastItemIndex - The index of the last item on the page.
     */
    fetchData?(firstItemIndex: number, lastItemIndex: number): T[] | Promise<T[]> | null;

    /* eslint-disable-next-line vue/require-default-prop -- ensuring the tool handles this */
    callback?: (value: T) => void;
}>();
</script>
