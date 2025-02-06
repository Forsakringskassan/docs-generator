import { ProcessorOptions, type Processor } from "../processor";

/**
 * @public
 */
export interface FontInterOptions extends ProcessorOptions {
    /** What url to fetch font from (default official CDN) */
    url?: string;
}

const style = /* HTML */ `
    <style>
        :root {
            --docs-font-family: Inter, Roboto, "Helvetica Neue", "Arial Nova",
                "Nimbus Sans", Arial, sans-serif;
            font-feature-settings:
                "liga" 1,
                "calt" 1;
        }
        @supports (font-variation-settings: normal) {
            :root {
                --docs-font-family: InterVariable, Roboto, "Helvetica Neue",
                    "Arial Nova", "Nimbus Sans", Arial, sans-serif;
            }
        }
    </style>
`;

/**
 * Add the Inter font.
 *
 * @public
 */
export function fontInterProcessor(options: FontInterOptions = {}): Processor {
    const { enabled = true, url = "https://rsms.me/inter/inter.css" } = options;

    return {
        after: "generate-docs",
        name: "font-inter-processor",
        async handler(context) {
            if (!enabled) {
                return;
            }

            const parsed = new URL(url);
            context.addTemplateBlock("head:early", "font-inter-fetch", {
                render() {
                    return [
                        `<link rel="preconnect" href="${parsed.origin}">`,
                        `<!-- [html-validate-disable-next require-sri -- no enabled for this resource] -->`,
                        `<link rel="stylesheet" href="https://rsms.me/inter/inter.css">`,
                    ].join("");
                },
            });
            context.addTemplateBlock("head", "font-inter-style", {
                render() {
                    return style;
                },
            });
        },
    };
}
