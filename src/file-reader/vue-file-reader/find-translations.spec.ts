import dedent from "dedent";
import { findTranslations } from "./find-translations";

describe("script setup", () => {
    it("should find translation key in template", () => {
        expect.assertions(1);
        const content = dedent(/* HTML */ `
            <script setup>
                import { useTranslate } from "@fkui/vue";

                const $t = useTranslate();
            </script>

            <template>
                <p>{{ $t('my.awesome.key') }}</p>
            </template>
        `);
        const result = findTranslations("AwesomeComponent.vue", content);
        expect(result).toEqual([
            {
                name: "my.awesome.key",
                defaultTranslation: null,
                description: null,
                parameters: [],
            },
        ]);
    });

    it("should find translation key in prop", () => {
        expect.assertions(1);
        const content = dedent(/* HTML */ `
            <script setup>
                import { useTranslate } from "@fkui/vue";

                const $t = useTranslate();

                const props = defineProps({
                    foo: {
                        type: String,
                        /** lorem foo ipsum */
                        default:
                            TranslationService.provider.translate("my.foo.key"),
                    },
                    bar: {
                        type: String,
                        default() {
                            /** lorem bar ipsum */
                            return TranslationService.provider.translate(
                                "my.bar.key",
                            );
                        },
                    },
                    baz: {
                        type: String,
                        default: () => {
                            /** lorem baz ipsum */
                            return TranslationService.provider.translate(
                                "my.baz.key",
                            );
                        },
                    },
                });
            </script>
        `);
        const result = findTranslations("AwesomeComponent.vue", content);
        expect(result).toEqual([
            {
                name: "my.foo.key",
                defaultTranslation: null,
                description: "lorem foo ipsum",
                parameters: [],
            },
            {
                name: "my.bar.key",
                defaultTranslation: null,
                description: "lorem bar ipsum",
                parameters: [],
            },
            {
                name: "my.baz.key",
                defaultTranslation: null,
                description: "lorem baz ipsum",
                parameters: [],
            },
        ]);
    });

    it("should find translation key in script", () => {
        expect.assertions(1);
        const content = dedent(/* HTML */ `
            <script setup>
                import { computed } from "vue";
                import { useTranslate } from "@fkui/vue";

                const $t = useTranslate();
                const text = $t("my.awesome.key");
            </script>
        `);
        const result = findTranslations("AwesomeComponent.vue", content);
        expect(result).toEqual([
            {
                name: "my.awesome.key",
                defaultTranslation: null,
                description: null,
                parameters: [],
            },
        ]);
    });

    it("should find translation key in computed", () => {
        expect.assertions(1);
        const content = dedent(/* HTML */ `
            <script setup>
                import { computed } from "vue";
                import { useTranslate } from "@fkui/vue";

                const $t = useTranslate();
                const text = computed(() => {
                    /** lorem ipsum */
                    return $t("my.awesome.key");
                });
            </script>
        `);
        const result = findTranslations("AwesomeComponent.vue", content);
        expect(result).toEqual([
            {
                name: "my.awesome.key",
                defaultTranslation: null,
                description: "lorem ipsum",
                parameters: [],
            },
        ]);
    });
});

describe("options", () => {
    it("should find translation key in template", () => {
        expect.assertions(1);
        const content = dedent(/* HTML */ `
            <script>
                import { defineComponent } from "vue";

                export default defineComponent({});
            </script>

            <template>
                <p>{{ $t('my.awesome.key') }}</p>
            </template>
        `);
        const result = findTranslations("AwesomeComponent.vue", content);
        expect(result).toEqual([
            {
                name: "my.awesome.key",
                defaultTranslation: null,
                description: null,
                parameters: [],
            },
        ]);
    });

    it("should find translation key in prop", () => {
        expect.assertions(1);
        const content = dedent(/* HTML */ `
            <script>
                import { defineComponent } from "@fkui/vue";

                export default defineComponent({
                    props: {
                        foo: {
                            type: String,
                            default:
                                TranslationService.provider.translate(
                                    "my.foo.key",
                                ),
                        },
                        bar: {
                            type: String,
                            default() {
                                return TranslationService.provider.translate(
                                    "my.bar.key",
                                );
                            },
                        },
                        baz: {
                            type: String,
                            default: () => {
                                return TranslationService.provider.translate(
                                    "my.baz.key",
                                );
                            },
                        },
                    },
                });
            </script>
        `);
        const result = findTranslations("AwesomeComponent.vue", content);
        expect(result).toEqual([
            {
                name: "my.foo.key",
                defaultTranslation: null,
                description: null,
                parameters: [],
            },
            {
                name: "my.bar.key",
                defaultTranslation: null,
                description: null,
                parameters: [],
            },
            {
                name: "my.baz.key",
                defaultTranslation: null,
                description: null,
                parameters: [],
            },
        ]);
    });

    it("should find translation key in computed", () => {
        expect.assertions(1);
        const content = dedent(/* HTML */ `
            <script>
                import { definecomponent } from "vue";

                export default defineComponent({
                    computed: {
                        text() {
                            return this.$t("my.awesome.key");
                        },
                    },
                });
            </script>
        `);
        const result = findTranslations("AwesomeComponent.vue", content);
        expect(result).toEqual([
            {
                name: "my.awesome.key",
                defaultTranslation: null,
                description: null,
                parameters: [],
            },
        ]);
    });
});

it("should find default translation", () => {
    expect.assertions(1);
    const content = dedent(/* HTML */ `
        <script setup>
            import { useTranslate } from "@fkui/vue";

            const $t = useTranslate();
        </script>

        <template>
            <p>{{ $t('my.awesome.key', 'default text') }}</p>
        </template>
    `);
    const result = findTranslations("AwesomeComponent.vue", content);
    expect(result).toEqual([
        {
            name: "my.awesome.key",
            defaultTranslation: "default text",
            description: null,
            parameters: [],
        },
    ]);
});

it("should find parameters", () => {
    expect.assertions(1);
    const content = dedent(/* HTML */ `
        <script setup>
            import { useTranslate } from "@fkui/vue";

            const $t = useTranslate();
        </script>

        <template>
            <pre>
                {{
                    $t('my.awesome.key', {
                        foo: '1',
                        /** short description */
                        bar: 2,
                        /**
                         * Long description
                         * over multiple
                         * lines.
                         */
                        baz: null,
                    })
                }}
            </pre
            >
        </template>
    `);
    const result = findTranslations("AwesomeComponent.vue", content);
    expect(result).toEqual([
        {
            name: "my.awesome.key",
            defaultTranslation: null,
            description: null,
            parameters: [
                { name: "foo", description: null },
                { name: "bar", description: "short description" },
                {
                    name: "baz",
                    description: "Long description\nover multiple\nlines.",
                },
            ],
        },
    ]);
});

it("should find default translation and parameters", () => {
    expect.assertions(1);
    const content = dedent(/* HTML */ `
        <script setup>
            import { useTranslate } from "@fkui/vue";

            const $t = useTranslate();
        </script>

        <template>
            <pre>
                {{
                    $t('my.awesome.key', "default translation", {
                        foo: 'bar',
                    })
                }}
            </pre
            >
        </template>
    `);
    const result = findTranslations("AwesomeComponent.vue", content);
    expect(result).toEqual([
        {
            name: "my.awesome.key",
            defaultTranslation: "default translation",
            description: null,
            parameters: [{ name: "foo", description: null }],
        },
    ]);
});

it("should find description", () => {
    expect.assertions(1);
    const content = dedent(/* HTML */ `
        <script setup>
            import { useTranslate } from "@fkui/vue";

            const $t = useTranslate();
        </script>

        <template>
            <pre>
                {{
                    /** short description */
                    $t('my.awesome.key')
                }}
            </pre
            >
            <pre>
                {{
                    /**
                     * Long description
                     * with multiple
                     * lines.
                     */
                    $t('another.awesome.key')
                }}
            </pre
            >
        </template>
    `);
    const result = findTranslations("AwesomeComponent.vue", content);
    expect(result).toEqual([
        {
            name: "my.awesome.key",
            defaultTranslation: null,
            description: "short description",
            parameters: [],
        },
        {
            name: "another.awesome.key",
            defaultTranslation: null,
            description: "Long description\nwith multiple\nlines.",
            parameters: [],
        },
    ]);
});
