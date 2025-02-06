import markdownIt from "markdown-it";
import { htmlencode, slugify } from "../../utils";
import { type ComponentProp } from "./component-api";

const md = markdownIt();
const EMPTY_CHAR = "&#8208;";

function render(text: string | null): string {
    return text ? md.render(text) : EMPTY_CHAR;
}

function renderInline(text: string | null): string {
    return text ? md.renderInline(text) : EMPTY_CHAR;
}

/**
 * @internal
 */
export function generatePropTable(
    slug: string,
    props: ComponentProp[],
): string {
    return /* HTML */ `
        <next-heading-level id="${slug}-props">
            <a class="header-anchor" href="#${slug}-props">Props</a>
        </next-heading-level>
        <dl class="docs-api docs-api--slots">
            ${props
                .map((prop) => {
                    const { name } = prop;
                    const id = `${slug}-prop-${slugify(name)}`;
                    return /* HTML */ `
                        <dt>
                            <code id="${id}"
                                ><a class="docs-api__anchor" href="#${id}"
                                    ><span class="docs-api__name"
                                        >${htmlencode(name)}</span
                                    >: ${htmlencode(prop.type ?? "unknown")}</a
                                ></code
                            >
                            ${prop.required
                                ? ""
                                : `<span class="docs-tag docs-tag--default">Optional</span>`}
                            ${prop.deprecated === null
                                ? ""
                                : `<span class="docs-tag docs-tag--deprecated">Deprecated</span>`}
                        </dt>
                        <dd>
                            ${render(prop.description)}
                            ${prop.default
                                ? `<p class="doc-api__item">Default: <code>${htmlencode(prop.default.value)}</code></p>`
                                : ""}
                            ${prop.deprecated
                                ? `<p class="doc-api__item docs-deprecated">Deprecated: ${renderInline(prop.deprecated)}</p>`
                                : ""}
                        </dd>
                    `;
                })
                .join("")}
        </dl>
    `;
}
