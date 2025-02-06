import markdownIt from "markdown-it";
import { htmlencode, slugify } from "../../utils";
import { type ComponentSlot } from "./component-api";

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
export function generateSlotTable(
    slug: string,
    slots: ComponentSlot[],
): string {
    return /* HTML */ `
        <next-heading-level id="${slug}-slots">
            <a class="header-anchor" href="#${slug}-slots">Slots</a>
        </next-heading-level>
        <dl class="docs-api docs-api--slots">
            ${slots
                .map((slot) => {
                    const { name } = slot;
                    const id = `${slug}-slot-${slugify(name)}`;
                    const haveBindings = slot.bindings.length > 0;
                    return /* HTML */ `
                        <dt>
                            <code id="${id}"
                                ><a class="docs-api__anchor" href="#${id}"
                                    ><span class="docs-api__name"
                                        >${htmlencode(name)}</span
                                    ></a
                                ></code
                            >
                            ${slot.deprecated === null
                                ? ""
                                : `<span class="docs-tag docs-tag--deprecated">Deprecated</span>`}
                        </dt>
                        <dd>
                            ${render(slot.description)}
                            ${haveBindings
                                ? `<p class="docs-api__list-title">Bindings:</p><ul class="docs-api__list">`
                                : ""}
                            ${slot.bindings
                                .map((it) => {
                                    if (it.description) {
                                        return `<li><code>${htmlencode(it.name)}: ${htmlencode(it.type ?? "unknown")}</code> ${EM_DASH} ${renderInline(it.description)}</li>`;
                                    } else {
                                        return `<li><code>${htmlencode(it.name)}: ${htmlencode(it.type ?? "unknown")}</code></li>`;
                                    }
                                })
                                .join("")}
                            ${haveBindings ? `</ul>` : ""}
                            ${slot.deprecated
                                ? `<p class="docs-api__deprecated docs-deprecated">Deprecated: ${renderInline(slot.deprecated)}</p>`
                                : ""}
                        </dd>
                    `;
                })
                .join("")}
        </dl>
    `;
}
