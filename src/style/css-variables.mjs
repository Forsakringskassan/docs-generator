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

    menu: {
        description: "Style related to the sidebar menu.",
        variables: {
            "width-expanded": {
                description: "Width of sidebar in desktop resolution.",
                value: "230px",
            },
        },
    },
};
