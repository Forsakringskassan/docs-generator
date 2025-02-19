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
            alias: undefined,
        };
    } else {
        return {
            package: vendor.package,
            alias: vendor.alias ?? undefined,
        };
    }
}
