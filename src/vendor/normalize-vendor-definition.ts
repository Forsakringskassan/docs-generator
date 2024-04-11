import {
    type NormalizedVendorDefinition,
    type VendorDefinition,
} from "./vendor-definition";

/**
 * @internal
 */
export function normalizeVendorDefinition(
    vendor: VendorDefinition,
): NormalizedVendorDefinition {
    if (typeof vendor === "string") {
        return {
            package: vendor,
            global: undefined,
            expose: "named",
            subpaths: [],
        };
    } else {
        return {
            package: vendor.package,
            global: vendor.global,
            expose: vendor.expose ?? "named",
            subpaths: vendor.subpaths ?? [],
            alias: vendor.alias ?? undefined,
        };
    }
}
