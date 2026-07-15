import defaultConfig, { globals } from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import cypressConfig from "@forsakringskassan/eslint-config-cypress";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";
import typeinfoConfig from "@forsakringskassan/eslint-config-typescript-typeinfo";
import vitestConfig from "@forsakringskassan/eslint-config-vitest";
import vueConfig from "@forsakringskassan/eslint-config-vue";

export default [
    {
        name: "Ignored files",
        ignores: [
            "**/coverage/**",
            "**/dist/**",
            "**/docs/examples/**/*-nolint*",
            "**/node_modules/**",
            "**/temp/**",
            "**/public/**",
        ],
    },

    ...defaultConfig,

    cliConfig({
        files: [
            "*.{js,ts,cjs,mjs}",
            "**/internal/*/*.{js,ts,cjs,mjs}",
            "**/scripts/*.{js,ts,cjs,mjs}",
        ],
    }),
    typescriptConfig(),
    typeinfoConfig(import.meta.dirname, {
        ignores: [
            "cypress.config.ts",
            "vitest.config.mts",
            "vitest.global.mts",
            "vitest.setup.mts",
            "cypress/**",
            "docs/**",
        ],
    }),
    vueConfig(),
    vitestConfig({
        files: ["**/*.spec.[jt]s", "vitest.*.mts"],
    }),
    cypressConfig(),

    {
        name: "local",
        rules: {
            "import-x/no-unresolved": "off",
            "import-x/no-extraneous-dependencies": "off",
        },
    },

    {
        name: "local/browser",
        files: ["src/shims/vue.js", "src/runtime/**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            "unicorn/no-top-level-side-effects": "off",
        },
    },

    {
        name: "local/docs",
        files: ["docs/**/*.vue"],
        rules: {
            "vue/define-emits-declaration": "off",
            "vue/define-props-declaration": "off",
            "vue/no-restricted-block": "off",
            "vue/no-unused-emit-declarations": "off",
            "vue/no-unused-properties": "off",
        },
    },

    {
        name: "local/examples",
        files: ["docs/examples/**/*.{js,ts}"],
        rules: {
            "no-console": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "eslint-comments/require-description": "off",
            "import-x/no-extraneous-dependencies": "off",
        },
    },

    {
        name: "local/fixtures",
        files: ["**/__fixtures__/*.vue"],
        rules: {
            "vue/define-emits-declaration": "off",
            "vue/define-props-declaration": "off",
            "vue/no-restricted-block": "off",
            "vue/no-unused-emit-declarations": "off",
            "vue/no-unused-properties": "off",
        },
    },

    {
        rules: {
            "unicorn/prefer-string-repeat": "off",
            "unicorn/prefer-unicode-code-point-escapes": "off",
            "unicorn/prefer-url-href": "off",
            "unicorn/require-css-escape": "off",
        },
    },
];
