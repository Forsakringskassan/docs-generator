import { type PackageJson } from "../package-json";
import { type ProcessorOptions, type Processor } from "../processor";

/**
 * Options for {@link selectableVersionProcessor#}.
 *
 * @public
 */
export interface SelectableVersionProcessorOptions extends ProcessorOptions {
    readonly message?: string;
}

/**
 * Make it possible to change version.
 *
 * @public
 */
export function selectableVersionProcessor(
    pkg: PackageJson,
    container: string,
    options?: SelectableVersionProcessorOptions,
): Processor {
    const { enabled = true, message = "Det finns en nyare version" } =
        options ?? {};

    return {
        name: "selectable-version-processor",
        after: "generate-docs",
        runtime: [
            {
                src: "src/runtime/select-version.ts",
                buildOptions: {
                    define: {
                        __PKG_VERSION__: JSON.stringify(pkg.version),
                        __MESSAGE__: JSON.stringify(message),
                    },
                },
            },
        ],
        handler(context) {
            if (!enabled) {
                return;
            }
            context.addTemplateBlock(container, "version", {
                filename: "partials/selectable-version.html",
                data: { pkg },
            });
        },
    };
}
