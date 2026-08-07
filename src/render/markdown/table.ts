/* eslint-disable camelcase -- upstream library uses snake_case */

import { type MarkdownIt } from "markdown-it";

export function table(): (md: MarkdownIt) => void {
    return function (md: MarkdownIt): void {
        md.renderer.rules.table_open = () => `<table class="table">\n`;
        md.renderer.rules.tr_open = () => `<tr class="table__row">\n`;
        md.renderer.rules.th_open = () =>
            `<th class="table__column table__column--text" scope="col">`;
        md.renderer.rules.td_open = () =>
            `<td class="table__column table__column--text">`;
    };
}
