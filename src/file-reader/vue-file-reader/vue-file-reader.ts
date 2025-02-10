import path from "node:path";
import { type DocumentPartial } from "../../document";
import { normalizePath } from "../../utils";
import { translateAPI } from "./translate-api";
import { type ComponentAPI } from "./component-api";
import { generatePropTable } from "./generate-prop-table";
import { generateEventTable } from "./generate-event-table";
import { generateSlotTable } from "./generate-slot-table";

function parseAPI(filePath: string, api: ComponentAPI): DocumentPartial {
    const relative = normalizePath(filePath);
    const parsedPath = path.parse(relative);
    const componentName = parsedPath.name;

    let html = "";
    if (api.props.length) {
        html += generatePropTable(api.slug, api.props);
    }
    if (api.events.length) {
        html += generateEventTable(api.slug, api.events);
    }
    if (api.slots.length) {
        html += generateSlotTable(api.slug, api.slots);
    }

    return {
        kind: "partial",
        id: `fs:${filePath.replace(/\\/g, "/")}`,
        name: `vue:${componentName}`,
        alias: [],
        body: html,
        format: "html",
        fileInfo: {
            fullPath: filePath,
        },
    };
}

/**
 * Generate API documentation from a Vue SFC.
 *
 * @public
 */
export async function vueFileReader(
    filePath: string,
): Promise<DocumentPartial[]> {
    const translated = await translateAPI(filePath);
    const doc = parseAPI(filePath, translated);
    return [doc];
}
