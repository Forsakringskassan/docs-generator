import markdownIt from "markdown-it";

const md = markdownIt({ breaks: true });

function generateTableHead(headers: string[]): string {
    return [
        "<thead><tr>",
        ...headers.map((header) => `<th>${header}</th>`),
        "</tr></thead>",
    ].join("");
}

function generateTableBody(content: string[][]): string {
    const rows = content.map((row) => {
        return [
            "<tr>",
            ...row.map((value) => `<td>${md.render(value)}</td>`),
            "</tr>",
        ].join("");
    });

    return ["<tbody>", ...rows, "</tbody>"].join("");
}

export function generateTable(
    caption: string,
    headers: string[],
    content: string[][],
): string {
    return [
        '<div class="docs-table"><table>',
        `<caption>${caption}</caption>`,
        generateTableHead(headers),
        generateTableBody(content),
        "</table></div>",
    ].join("");
}
