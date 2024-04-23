require("@forsakringskassan/eslint-config/patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: ["@forsakringskassan"],

    rules: {
        "import/no-unresolved": "off",
        "import/no-extraneous-dependencies": "off",
    },

    overrides: [
        {
            /* ensure we lint *.cjs and *.mjs files as well */
            files: ["*.cjs", "*.mjs"],
        },
        {
            files: "*.mjs",
            rules: {
                "import/extensions": ["error", "always"],
            },
        },
        {
            files: [
                "./*.{js,ts,cjs,mjs}",
                "**/internal/*/*.{js,ts,cjs,mjs}",
                "**/scripts/*.{js,ts,cjs,mjs}",
            ],
            extends: ["@forsakringskassan/cli"],
        },
        {
            files: "*.ts",
            extends: ["@forsakringskassan/typescript"],
        },
        {
            files: "*.vue",
            extends: ["@forsakringskassan/vue"],
        },
        {
            files: "*.spec.[jt]s",
            extends: ["@forsakringskassan/jest"],
        },
        {
            files: "*.cy.[jt]s",
            extends: ["@forsakringskassan/cypress"],
        },
    ],
};
