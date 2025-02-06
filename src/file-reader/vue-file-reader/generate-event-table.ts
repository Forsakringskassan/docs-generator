import markdownIt from "markdown-it";
import { htmlencode, slugify } from "../../utils";
import { type ComponentEvent } from "./component-api";

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
export function generateEventTable(
    slug: string,
    events: ComponentEvent[],
): string {
    return /* HTML */ `
        <next-heading-level id="${slug}-events">
            <a class="header-anchor" href="#${slug}-events">Events</a>
        </next-heading-level>
        <dl class="docs-api docs-api--events">
            ${events
                .map((event) => {
                    const { name } = event;
                    const id = `${slug}-event-${slugify(name)}`;
                    const haveProperties = event.properties.length > 0;
                    return /* HTML */ `
                        <dt>
                            <code id="${id}"
                                ><a class="docs-api__anchor" href="#${id}"
                                    ><span class="docs-api__name"
                                        >${htmlencode(name)}</span
                                    ></a
                                ></code
                            >
                            ${event.deprecated === null
                                ? ""
                                : `<span class="docs-tag docs-tag--deprecated">Deprecated</span>`}
                        </dt>
                        <dd>
                            ${render(event.description)}
                            ${haveProperties
                                ? `<p class="docs-api__list-title">Arguments:</p><ul class="docs-api__list">`
                                : ""}
                            ${event.properties
                                .map((it) => {
                                    if (it.description) {
                                        return `<li><code>${htmlencode(it.name)}: ${htmlencode(it.type ?? "unknown")}</code> ${EM_DASH} ${renderInline(it.description)}</li>`;
                                    } else {
                                        return `<li><code>${htmlencode(it.name)}: ${htmlencode(it.type ?? "unknown")}</code></li>`;
                                    }
                                })
                                .join("")}
                            ${haveProperties ? `</ul>` : ""}
                            ${event.deprecated
                                ? `<p class="docs-api__deprecated docs-deprecated">Deprecated: ${renderInline(event.deprecated)}</p>`
                                : ""}
                        </dd>
                    `;
                })
                .join("")}
        </dl>
    `;
}
