export default {
    "*": {
        description: "Global styling, e.g. default values.",
        variables: {
            "font-family": {
                description: "Default `font-family`.",
                type: "font",
                value: `arial, "Helvetica Neue", sans-serif`,
            },
            "font-weight": {
                description: "Default `font-weight`.",
                value: "normal",
            },
            "text-color-default": {
                description: "Default text color for regular text.",
                type: "color",
                value: "#1b1e23",
            },
            "text-color-discrete": {
                description:
                    "Default text color for discrete text (text that is less important, usually appears a bit dimmer than regular text",
                type: "color",
                value: "#5f6165",
            },
            "text-color-link": {
                description: "Link text color.",
                type: "color",
                value: "#4a52b6",
            },
            "text-color-link-hover": {
                description: "Link text color.",
                type: "color",
                value: "#1b1e23",
            },
        },
    },

    heading: {
        description: "Headings h1, h2, etc.",
        variables: {
            "font-family": {
                type: "font",
                value: `var(--docs-font-family)`,
            },
            "font-weight": { value: "var(--docs-font-weight)" },
            "line-height": { value: "1.4" },
        },
    },

    header: {
        description: "Style related to page header",
        variables: {
            "text-color-default": {
                description:
                    "`--docs-text-color-default` is overridden with this value.",
                type: "color",
                value: "#1b1e23",
            },
            "text-color-discrete": {
                description:
                    "`--docs-text-color-discrete` is overridden with this value.",
                type: "color",
                value: "#5f6165",
            },
        },
    },

    menu: {
        description: "Style related to the sidebar menu.",
        variables: {
            "width-expanded": {
                description: "Width of sidebar in desktop resolution.",
                value: "230px",
            },
        },
    },

    version: {
        description: "Version processor",
        variables: {
            "text-color": {
                description: "Text color",
                type: "color",
                value: "var(--docs-text-color-discrete)",
            },
            "link-color": {
                description: "Link color",
                type: "color",
                value: "var(--docs-text-color-discrete)",
            },
            "hover-color": {
                description: "Link color",
                type: "color",
                value: "var(--docs-text-color-default)",
            },
        },
    },

    cookie: {
        description: "Cookie processor",
        variables: {
            "background-color": {
                description: "Background color",
                type: "color",
                value: "#f5f6fa",
            },
            "border-color": {
                description: "Border color",
                type: "color",
                value: "#4a52b6",
            },
        },
    },
};
