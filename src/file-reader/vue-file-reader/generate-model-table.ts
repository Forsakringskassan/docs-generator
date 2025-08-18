import markdownIt from "markdown-it";
import { htmlencode, slugify } from "../../utils";
import { type ComponentModel } from "./component-api";

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
export function generateModelTable(
    slug: string,
    models: ComponentModel[],
): string {
    return /* HTML */ `
        <next-heading-level id="${slug}-models">
            <a class="header-anchor" href="#${slug}-models">Models</a>
        </next-heading-level>
        <dl class="docs-api docs-api--models">
            ${models
                .map((model) => {
                    const { name } = model;
                    const id = `${slug}-model-${slugify(name)}`;
                    return /* HTML */ `
                        <dt>
                            <code id="${id}"
                                ><a class="docs-api__anchor" href="#${id}"
                                    ><span class="docs-api__name"
                                        >${htmlencode(name)}</span
                                    >: ${htmlencode(model.type ?? "unknown")}</a
                                ></code
                            >
                            ${model.required
                                ? ""
                                : `<span class="docs-tag docs-tag--default">Optional</span>`}
                            ${model.deprecated === null
                                ? ""
                                : `<span class="docs-tag docs-tag--deprecated">Deprecated</span>`}
                        </dt>
                        <dd>
                            ${render(model.description)}
                            ${model.default
                                ? `<p class="doc-api__item">Default: <code>${htmlencode(model.default.value)}</code></p>`
                                : ""}
                            ${model.deprecated
                                ? `<p class="doc-api__item docs-deprecated">Deprecated: ${renderInline(model.deprecated)}</p>`
                                : ""}
                        </dd>
                    `;
                })
                .join("")}
        </dl>
    `;
}
