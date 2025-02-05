import markdownIt from "markdown-it";
import { type ComponentEvent } from "./component-api";

const md = markdownIt();
const EMPTY_CHAR = "&#8208;";
const EM_DASH = "&#8212;";

function render(text: string | null): string {
    return text ? md.render(text) : EMPTY_CHAR;
}

/**
 * @internal
 */
export function generateEventTable(events: ComponentEvent[]): string {
    return /* HTML */ `
        <div class="docs-table">
            <table>
                <caption>
                    Events
                </caption>
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Properties</th>
                        <th scope="col">Deprecated</th>
                    </tr>
                </thead>
                <tbody>
                    ${events
                        .map(
                            (event) => /* HTML */ `
                                <tr>
                                    <td><code>${event.name}</code></td>
                                    <td>${render(event.description)}</td>
                                    <td>
                                        ${event.properties
                                            .map((it) => {
                                                if (it.description) {
                                                    return `<code>${it.name}: ${it.type}</code> ${EM_DASH} ${it.description}`;
                                                } else {
                                                    return `<code>${it.name}: ${it.type}</code>`;
                                                }
                                            })
                                            .join("<br>")}
                                    </td>
                                    <td>
                                        ${event.deprecated === null
                                            ? EMPTY_CHAR
                                            : event.deprecated}
                                    </td>
                                </tr>
                            `,
                        )
                        .join("")}
                </tbody>
            </table>
        </div>
    `;
}
