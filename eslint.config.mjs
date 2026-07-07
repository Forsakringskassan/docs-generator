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
        files: ["src/shims/vue.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
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
            "unicorn/no-declarations-before-early-exit": "off",
            "unicorn/no-duplicate-loops": "off",
            "unicorn/no-global-object-property-assignment": "off",
            "unicorn/no-top-level-assignment-in-function": "off",
            "unicorn/no-top-level-side-effects": "off",
            "unicorn/no-unnecessary-boolean-comparison": "off",
            "unicorn/no-unreadable-for-of-expression": "off",
            "unicorn/no-useless-else": "off",
            "unicorn/no-useless-recursion": "off",
            "unicorn/no-useless-template-literals": "off",
            "unicorn/numeric-separators-style": "off",
            "unicorn/prefer-array-some": "off",
            "unicorn/prefer-await": "off",
            "unicorn/prefer-direct-iteration": "off",
            "unicorn/prefer-dom-node-replace-children": "off",
            "unicorn/prefer-early-return": "off",
            "unicorn/prefer-https": "off",
            "unicorn/prefer-iterator-to-array": "off",
            "unicorn/prefer-native-coercion-functions": "off",
            "unicorn/prefer-number-coercion": "off",
            "unicorn/prefer-queue-microtask": "off",
            "unicorn/prefer-split-limit": "off",
            "unicorn/prefer-string-repeat": "off",
            "unicorn/prefer-unicode-code-point-escapes": "off",
            "unicorn/prefer-url-href": "off",
            "unicorn/require-css-escape": "off",
        },
    },
];
