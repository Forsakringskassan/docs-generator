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
            "unicorn/better-regex": "off",
            "unicorn/consistent-existence-index-check": "off",
            "unicorn/consistent-function-scoping": "off",
            "unicorn/custom-error-definition": "off",
            "unicorn/explicit-length-check": "off",
            "unicorn/filename-case": "off",
            "unicorn/no-array-for-each": "off",
            "unicorn/no-array-method-this-argument": "off",
            "unicorn/no-array-sort": "off",
            "unicorn/no-await-expression-member": "off",
            "unicorn/no-for-loop": "off",
            "unicorn/no-hex-escape": "off",
            "unicorn/no-object-as-default-parameter": "off",
            "unicorn/no-typeof-undefined": "off",
            "unicorn/no-zero-fractions": "off",
            "unicorn/prefer-array-flat-map": "off",
            "unicorn/prefer-at": "off",
            "unicorn/prefer-code-point": "off",
            "unicorn/prefer-date-now": "off",
            "unicorn/prefer-dom-node-append": "off",
            "unicorn/prefer-dom-node-dataset": "off",
            "unicorn/prefer-dom-node-text-content": "off",
            "unicorn/prefer-import-meta-properties": "off",
            "unicorn/prefer-node-protocol": "off",
            "unicorn/prefer-number-properties": "off",
            "unicorn/prefer-set-has": "off",
            "unicorn/prefer-string-replace-all": "off",
            "unicorn/prefer-top-level-await": "off",
            "unicorn/prefer-type-error": "off",
            "unicorn/text-encoding-identifier-case": "off",
        },
    },
];
