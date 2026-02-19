export default {
    "*": {
        description: "Global styling, e.g. default values.",
        variables: {
            "background-color": {
                description: "Default background color",
                type: "color",
                value: "#ffffff",
            },
            "font-family": {
                description: "Default `font-family`.",
                type: "font",
                value: `"Inter Variable", sans-serif`,
            },
            "font-line-height": {
                description: "Default `font-line-height`.",
                value: "1.5",
            },
            "font-size": {
                description: "Default `font-size`.",
                type: "length",
                value: "16px",
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
            "info-color": {
                description: "Default info color.",
                type: "color",
                value: "#4a52b6",
            },
            "info-background": {
                description: "Default info background.",
                type: "color",
                value: "#f5f6fa",
            },
            "warning-color": {
                description: "Default warning color.",
                type: "color",
                value: "#ffbe10",
            },
            "warning-background": {
                description: "Default warning background.",
                type: "color",
                value: "#fffcf3",
            },
            "error-color": {
                description: "Default warning color.",
                type: "color",
                value: "#ca1515",
            },
            "error-background": {
                description: "Default warning background.",
                type: "color",
                value: "#fcf3f3",
            },
        },
    },

    badge: {
        description: "Component badges",
        variables: {
            "component-color": {
                description: "Component badge text color",
                type: "color",
                value: "var(--docs-text-color-default)",
            },
            "component-background": {
                description: "Component badge background color",
                type: "color",
                value: "#ddddde",
            },
            "component-border": {
                description: "Component badge border color",
                type: "color",
                value: "#ddddde",
            },
        },
    },

    contextmenu: {
        description: "Style related to contextual menus",
        variables: {
            "background-color": {
                description: "Context menu background color",
                type: "color",
                value: "#ffffff",
            },
            "border-color": {
                description: "Context menu border color",
                type: "color",
                value: "#ddddde",
            },
            "highlight-color": {
                description: "Context menu highlight color",
                type: "color",
                value: "#e7f0e9",
            },
            "link-color-default": {
                description: "Context menu link default color",
                type: "color",
                value: "var(--docs-text-color-default)",
            },
            "link-color-hover": {
                description: "Context menu link hover color",
                type: "color",
                value: "var(--docs-text-color-default)",
            },
            "link-background-hover": {
                description: "Context menu link hover background color",
                type: "color",
                value: "#ddddde",
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
            "font-weight-h1": {
                description: "Default `font-weight` for `h1` headings.",
                value: `var(--docs-font-weight)`,
            },
            "font-weight-h2": {
                description: "Default `font-weight` for `h2` headings.",
                value: `var(--docs-font-weight)`,
            },
            "font-weight-h3": {
                description: "Default `font-weight` for `h3` headings.",
                value: `var(--docs-font-weight)`,
            },
            "font-weight-h4": {
                description: "Default `font-weight` for `h4` headings.",
                value: `var(--docs-font-weight)`,
            },
            "font-weight-h5": {
                description: "Default `font-weight` for `h5` headings.",
                value: `var(--docs-font-weight)`,
            },
            "font-weight-h6": {
                description: "Default `font-weight` for `h6` headings.",
                value: `var(--docs-font-weight)`,
            },
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
            "background-color": {
                type: "color",
                value: "transparent",
                description: "Background color for page header.",
            },
            "border-color": {
                type: "color",
                value: "#ddddde",
                description: "Border color for page header.",
            },
        },
    },

    footer: {
        description: "Style related to page footer",
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
            "background-color": {
                type: "color",
                value: "transparent",
                description: "Background color for page footer.",
            },
            "border-color": {
                type: "color",
                value: "#ddddde",
                description: "Border color for page footer.",
            },
        },
    },

    menu: {
        description: "Style related to the sidebar menu.",
        variables: {
            "background-color": {
                type: "color",
                value: "transparent",
                description: "Background color for sidebar.",
            },
            "width-expanded": {
                description: "Width of sidebar in desktop resolution.",
                value: "230px",
            },
        },
    },

    messagebox: {
        description: "Style related to markdown messageboxes.",
        variables: {
            "details-border": {
                description: "Border color for details variant",
                type: "color",
                value: "#bbbbbd",
            },
            "details-background": {
                description: "Background color for details variant",
                type: "color",
                value: "#f4f4f4",
            },
            "info-border": {
                description: "Border color for info variant",
                type: "color",
                value: "var(--docs-info-color)",
            },
            "info-background": {
                description: "Background color for info variant",
                type: "color",
                value: "var(--docs-info-background)",
            },
            "warning-border": {
                description: "Border color for warning variant",
                type: "color",
                value: "var(--docs-warning-color)",
            },
            "warning-background": {
                description: "Background color for warning variant",
                type: "color",
                value: "var(--docs-warning-background)",
            },
            "danger-border": {
                description: "Border color for danger variant",
                type: "color",
                value: "var(--docs-error-color)",
            },
            "danger-background": {
                description: "Background color for danger variant",
                type: "color",
                value: "var(--docs-error-background)",
            },
        },
    },

    motd: {
        description: "MOTD processor",
        variables: {
            "text-color": {
                description: "Text color",
                type: "color",
                value: "var(--docs-text-color-discrete)",
            },
            "info-accent-color": {
                description: "Accent color, info variant",
                type: "color",
                value: "#4a52b6",
            },
            "info-background-color": {
                description: "background color, info variant",
                type: "color",
                value: "#f5f6fa",
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

    outline: {
        description: "Style related to outline",
        variables: {
            "heading-heading-color": {
                description: "Header color",
                type: "color",
                value: "#5f6165",
            },
            "list-border-color": {
                description: "Outline border color in small device mode",
                type: "color",
                value: "#ddddde",
            },
            "active-border-color": {
                description: "Border color for the current active item",
                type: "color",
                value: "#116a3e",
            },
            "hover-background-color": {
                description: "Background color during hover",
                type: "color",
                value: "#ddddde",
            },
        },
    },

    tags: {
        description: "Style for documentation tags",
        variables: {
            "optional-background-color": {
                description: "Optional tag background color",
                type: "color",
                value: "transparent",
            },
            "optional-border-color": {
                description: "Optional tag border color",
                type: "color",
                value: "#5f6165",
            },
            "optional-text-color": {
                description: "Optional tag text color",
                type: "color",
                value: "var(--docs-text-color-discrete)",
            },
            "deprecated-background-color": {
                description: "Deprecated tag background color",
                type: "color",
                value: "var(--docs-error-color)",
            },
            "deprecated-border-color": {
                description: "Deprecated tag border color",
                type: "color",
                value: "#1b1e23",
            },
            "deprecated-text-color": {
                description: "Deprecated tag text color",
                type: "color",
                value: "var(--docs-error-background)",
            },
        },
    },

    topnav: {
        description: "Style related to topnav",
        variables: {
            "background-color": {
                description: "Background color",
                type: "color",
                value: "transparent",
            },
            "link-color-default": {
                description: "Link color",
                type: "color",
                value: "var(--docs-text-color-default)",
            },
            "link-color-hover": {
                description: "Link hover color",
                type: "color",
                value: "var(--docs-text-color-link-hover)",
            },
            "link-color-highlight": {
                description: "Link highlight color",
                type: "color",
                value: "var(--docs-text-color-link-hover)",
            },
            "border-color-hover": {
                description: "Border hover color",
                type: "color",
                value: "#afcfb5",
            },
            "border-color-highlight": {
                description: "Border highlight color",
                type: "color",
                value: "#116a3e",
            },
        },
    },

    search: {
        description: "Style related to search processor",
        variables: {
            "text-color": {
                description:
                    "`--docs-text-color-default` is overridden with this value.",
                type: "color",
                value: "inherit",
            },
            "background-color": {
                description: "Background color for search dialog",
                type: "color",
                value: "var(--docs-background-color)",
            },
            "border-color": {
                description: "Border color for search dialog",
                type: "color",
                value: "#000",
            },
            "button-color-hover": {
                description: "Button hover in top navigation",
                type: "color",
                value: "#f4f4f4",
            },
        },
    },

    version: {
        description: "Version processor",
        variables: {
            "text-color": {
                description:
                    "`--docs-text-color-default` is overridden with this value.",
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
            "background-color": {
                description: "Background color for version dialog",
                type: "color",
                value: "var(--docs-background-color)",
            },
            "border-color": {
                description: "Border color for version dialog",
                type: "color",
                value: "#000",
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

    code: {
        description: "Code mark-up",
        variables: {
            "background-color": {
                description: "Default code background.",
                type: "color",
                value: "#f4f4f4",
            },
            "border-color": {
                description: "Default code border.",
                type: "color",
                value: "#ddddde",
            },
            "optional-background-color": {
                description: "darker code background.",
                type: "color",
                value: "#e5e5e5",
            },
        },
    },
    navigation: {
        description: "Style related to navigation",
        variables: {
            "active-background": {
                description: "Link active background color",
                type: "color",
                value: "#ddd",
            },
            "highlight-color": {
                description: "Link highlight color",
                type: "color",
                value: "#116a3e",
            },
            "hover-color": {
                description: "Link hover color",
                type: "color",
                value: "#ddd",
            },
        },
    },
};
