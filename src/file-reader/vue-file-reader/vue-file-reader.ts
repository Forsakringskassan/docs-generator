import path from "node:path";
import { type Document } from "../../document";
import { normalizePath } from "../../utils";
import { translateAPI } from "./translate-api";
import {
    ComponentAPI,
    ComponentProp,
    ComponentEvent,
    ComponentSlot,
} from "./component-api";
import { generateTable } from "./generate-table";

function capitalize(text: string): string {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function parseAPIToArray(
    api: ComponentProp[] | ComponentEvent[] | ComponentSlot[],
): string[][] {
    const content = [];

    const headers = Object.keys(api[0]);
    const capitalizedHeaders = headers.map(capitalize);
    content.push(capitalizedHeaders);

    for (const row of api) {
        content.push(Object.values(row));
    }

    return content;
}

function parseAPI(filePath: string, api: ComponentAPI): Document {
    const relative = normalizePath(filePath);
    const parsedPath = path.parse(relative);
    const componentName = parsedPath.name;

    let html = "";
    if (api.props.length) {
        const propsArray = parseAPIToArray(api.props);
        html += generateTable("Props", propsArray[0], propsArray.slice(1));
    }
    if (api.events.length) {
        const eventsArray = parseAPIToArray(api.events);
        html += generateTable("Events", eventsArray[0], eventsArray.slice(1));
    }
    if (api.slots.length) {
        const slotsArray = parseAPIToArray(api.slots);
        html += generateTable("Slots", slotsArray[0], slotsArray.slice(1));
    }

    return {
        id: `fs:${filePath.replace(/\\/g, "/")}`,
        name: `vue:${componentName}`,
        alias: [],
        visible: false,
        attributes: { sortorder: Infinity, redirectFrom: [] },
        body: html,
        outline: [],
        format: "html",
        tags: [],
        template: "",
        fileInfo: {
            path: "",
            name: "",
            fullPath: "",
            outputName: false,
        },
    };
}

/**
 * Generate API documentation from a Vue SFC.
 *
 * @public
 */
export async function vueFileReader(filePath: string): Promise<Document[]> {
    const translated = await translateAPI(filePath);
    const doc = parseAPI(filePath, translated);
    return [doc];
}
