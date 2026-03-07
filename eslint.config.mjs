import defaultConfig, { globals } from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import cypressConfig from "@forsakringskassan/eslint-config-cypress";
import jestConfig from "@forsakringskassan/eslint-config-jest";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";
import typeinfoConfig from "@forsakringskassan/eslint-config-typescript-typeinfo";
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
            "jest.setup.ts",
            "cypress/**",
            "docs/**",
        ],
    }),
    vueConfig(),
    jestConfig({
        files: ["**/*.spec.[jt]s", "jest.*.js"],
    }),
    cypressConfig(),

    {
        name: "local",
        rules: {
            "import/no-unresolved": "off",
            "import/no-extraneous-dependencies": "off",
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
            "import/no-extraneous-dependencies": "off",
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
        name: "local/technical-debt",
        rules: {
            "sonarjs/slow-regex": "off",
        },
    },
];
