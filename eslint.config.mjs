import defaultConfig, {
    globals,
} from "@forsakringskassan/eslint-config/flat.mjs";
import cliConfig from "@forsakringskassan/eslint-config-cli/flat.mjs";
import cypressConfig from "@forsakringskassan/eslint-config-cypress/flat.mjs";
import jestConfig from "@forsakringskassan/eslint-config-jest/flat.mjs";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript/flat.mjs";
import vueConfig from "@forsakringskassan/eslint-config-vue/flat.mjs";

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
    vueConfig(),
    jestConfig(),
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
];
