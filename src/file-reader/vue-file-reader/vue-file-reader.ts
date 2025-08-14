import fs from "node:fs/promises";
import path from "node:path";
import { type DocumentPartial } from "../../document";
import { normalizePath } from "../../utils";
import { translateAPI } from "./translate-api";
import { type ComponentAPI } from "./component-api";
import { generateModelTable } from "./generate-model-table";
import { generatePropTable } from "./generate-prop-table";
import { generateEventTable } from "./generate-event-table";
import { generateSlotTable } from "./generate-slot-table";
import { findTranslations } from "./find-translations";
import { generateTranslationTable } from "./generate-translation-table";

function parseAPI(filePath: string, api: ComponentAPI): DocumentPartial {
    const relative = normalizePath(filePath);
    const parsedPath = path.parse(relative);
    const componentName = parsedPath.name;

    let html = "";
    if (api.models.length) {
        html += generateModelTable(api.slug, api.models);
    }
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
        id: `fs:${filePath.replace(/\\/g, "/")}:api`,
        name: `vue:${componentName}`,
        alias: [],
        body: html,
        format: "html",
        fileInfo: {
            fullPath: filePath,
        },
    };
}

async function parseTranslation(
    slug: string,
    filePath: string,
): Promise<DocumentPartial> {
    const relative = normalizePath(filePath);
    const parsedPath = path.parse(relative);
    const componentName = parsedPath.name;
    const content = await fs.readFile(filePath, "utf-8");
    return {
        kind: "partial",
        id: `fs:${filePath.replace(/\\/g, "/")}:translation`,
        name: `translation:${componentName}`,
        alias: [],
        get body() {
            const translations = findTranslations(filePath, content);
            return generateTranslationTable(slug, translations);
        },
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
    const vueApi = parseAPI(filePath, translated);
    const vueTranslation = await parseTranslation(translated.slug, filePath);
    return [vueApi, vueTranslation];
}
