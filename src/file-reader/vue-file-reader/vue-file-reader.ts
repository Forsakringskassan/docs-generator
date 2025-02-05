import path from "node:path";
import { type Document } from "../../document";
import { normalizePath } from "../../utils";
import { translateAPI } from "./translate-api";
import { type ComponentAPI } from "./component-api";
import { generatePropTable } from "./generate-prop-table";
import { generateEventTable } from "./generate-event-table";
import { generateSlotTable } from "./generate-slot-table";

function parseAPI(filePath: string, api: ComponentAPI): Document {
    const relative = normalizePath(filePath);
    const parsedPath = path.parse(relative);
    const componentName = parsedPath.name;

    let html = "";
    if (api.props.length) {
        html += generatePropTable(api.props);
    }
    if (api.events.length) {
        html += generateEventTable(api.events);
    }
    if (api.slots.length) {
        html += generateSlotTable(api.slots);
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
