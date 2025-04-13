import markdownIt from "markdown-it";
import { htmlencode, slugify } from "../../utils";
import { type TranslationKey } from "./translation-key";

const md = markdownIt();
const EMPTY_CHAR = "&#8208;";
const EM_DASH = `<span role="presentation">&mdash;</span>`;

function render(text: string | null): string {
    return text ? md.render(text) : EMPTY_CHAR;
}

function renderInline(text: string | null): string {
    return text ? md.renderInline(text) : EMPTY_CHAR;
}

/**
 * @internal
 */
export function generateTranslationTable(
    slug: string,
    translations: TranslationKey[],
): string {
    return /* HTML */ `
        <dl class="docs-api docs-api--translation">
            ${translations
                .map((translation) => {
                    const { name } = translation;
                    const id = `${slug}-translation-${slugify(name)}`;
                    const haveParameters = translation.parameters.length > 0;
                    return /* HTML */ `
                        <dt>
                            <code id="${id}"
                                ><a class="docs-api__anchor" href="#${id}"
                                    ><span class="docs-api__name"
                                        >${htmlencode(name)}</span
                                    ></a
                                ></code
                            >
                        </dt>
                        <dd>
                            ${render(translation.description)}
                            ${translation.defaultTranslation
                                ? `<p class="doc-api__item">Default: "${htmlencode(translation.defaultTranslation)}"</p>`
                                : ""}
                            ${haveParameters
                                ? `<p class="docs-api__list-title">Parameters:</p><ul class="docs-api__list">`
                                : ""}
                            ${translation.parameters
                                .map((it) => {
                                    if (it.description) {
                                        return `<li><code>${htmlencode(it.name)}</code> ${EM_DASH} ${renderInline(it.description)}</li>`;
                                    } else {
                                        return `<li><code>${htmlencode(it.name)}</code></li>`;
                                    }
                                })
                                .join("")}
                            ${haveParameters ? `</ul>` : ""}
                        </dd>
                    `;
                })
                .join("")}
        </dl>
    `;
}
