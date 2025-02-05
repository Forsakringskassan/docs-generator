import markdownIt from "markdown-it";
import { type ComponentSlot } from "./component-api";

const md = markdownIt();
const EMPTY_CHAR = "&#8208;";
const EM_DASH = "&#8212;";

function render(text: string | null): string {
    return text ? md.render(text) : EMPTY_CHAR;
}

/**
 * @internal
 */
export function generateSlotTable(slots: ComponentSlot[]): string {
    return /* HTML */ `
        <div class="docs-table">
            <table>
                <caption>
                    Slots
                </caption>
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Bindings</th>
                        <th scope="col">Deprecated</th>
                    </tr>
                </thead>
                <tbody>
                    ${slots
                        .map(
                            (slot) => /* HTML */ `
                                <tr>
                                    <td><code>${slot.name}</code></td>
                                    <td>${render(slot.description)}</td>
                                    <td>
                                        ${slot.bindings
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
                                        ${slot.deprecated === null
                                            ? EMPTY_CHAR
                                            : slot.deprecated}
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
