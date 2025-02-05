import markdownIt from "markdown-it";
import { type ComponentProp } from "./component-api";

const md = markdownIt();
const EMPTY_CHAR = "&#8208;";

function render(text: string | null): string {
    return text ? md.render(text) : EMPTY_CHAR;
}

/**
 * @internal
 */
export function generatePropTable(props: ComponentProp[]): string {
    return /* HTML */ `
        <div class="docs-table">
            <table>
                <caption>
                    Props
                </caption>
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Type</th>
                        <th scope="col">Required</th>
                        <th scope="col">Default</th>
                        <th scope="col">Deprecated</th>
                    </tr>
                </thead>
                <tbody>
                    ${props
                        .map(
                            (prop) => /* HTML */ `
                                <tr>
                                    <td><code>${prop.name}</code></td>
                                    <td>${render(prop.description)}</td>
                                    <td><code>${prop.type}</code></td>
                                    <td>${prop.required ? "true" : "false"}</td>
                                    <td>
                                        ${prop.default
                                            ? `<code>${prop.default.value}</code>`
                                            : EMPTY_CHAR}
                                    </td>
                                    <td>
                                        ${prop.deprecated !== null
                                            ? prop.deprecated
                                            : EMPTY_CHAR}
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
