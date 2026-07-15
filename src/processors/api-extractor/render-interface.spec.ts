import path from "node:path";
import {
    type ApiInterface,
    type ApiItem,
    ApiItemKind,
    ApiModel,
} from "@microsoft/api-extractor-model";
import { describe, expect, it } from "vitest";
import { renderInterface } from "./render-interface";

const fixture = path.join(__dirname, "__fixtures__/model.api.json");

const apiModel = new ApiModel();
const apiPackage = apiModel.loadPackage(fixture);
const [entrypoint] = apiPackage.entryPoints;

const variant = renderInterface();

expect.addSnapshotSerializer({
    test() {
        return true;
    },
    serialize: String,
});

function isApiFunction(item: ApiItem): item is ApiInterface {
    return item.kind === ApiItemKind.Interface;
}

function findInterface(name: string): ApiInterface | undefined {
    return entrypoint.members
        .filter(isApiFunction)
        .find((it) => it.name === name);
}

describe("code", () => {
    it("should render interface", () => {
        expect.assertions(1);
        const item = findInterface("Foo")!;
        const result = variant.interface(item, {
            inherit: false,
        });
        expect(result).toMatchInlineSnapshot(`
                \`\`\`ts nocompile nolint
                interface Foo {
                    /**
                     * Lorem ipsum dolor sit amet.
                     */
                    documented: string;
                    enumeration: "foo" | "bar";
                    optional?: number;
                    required: string;
                }
                \`\`\`
        `);
    });

    it("should render extended interface (inherit)", () => {
        expect.assertions(1);
        const item = findInterface("Bar")!;
        const result = variant.interface(item, {
            inherit: true,
        });
        expect(result).toMatchInlineSnapshot(`
            \`\`\`ts nocompile nolint
            interface Bar {
                /**
                 * Overridden documentation.
                 */
                documented: string;
                enumeration: "foo" | "bar";
                optional?: number;
                required: string;
            }
            \`\`\`
        `);
    });

    it("should render extended interface (noinherit)", () => {
        expect.assertions(1);
        const item = findInterface("Bar")!;
        const result = variant.interface(item, {
            inherit: false,
        });
        expect(result).toMatchInlineSnapshot(`
                \`\`\`ts nocompile nolint
                interface Bar extends Foo {
                    /**
                     * Overridden documentation.
                     */
                    documented: string;
                }
                \`\`\`
        `);
    });
});

describe("properties", () => {
    it("should render interface", () => {
        expect.assertions(1);
        const item = findInterface("Foo")!;
        const result = variant.properties(item, {
            inherit: false,
        });
        expect(result).toMatchInlineSnapshot(`
                \`documented: string;\`
                : Lorem ipsum dolor sit amet.

                \`enumeration: "foo" | "bar";\`
                : &dash;

                \`optional?: number;\` {@optional}
                : &dash;

                \`required: string;\`
                : &dash;

        `);
    });

    it("should render extended interface (inherit)", () => {
        expect.assertions(1);
        const item = findInterface("Bar")!;
        const result = variant.properties(item, {
            inherit: true,
        });
        expect(result).toMatchInlineSnapshot(`
                \`documented: string;\`
                : Overridden documentation.

                \`enumeration: "foo" | "bar";\`
                : &dash;

                \`optional?: number;\` {@optional}
                : &dash;

                \`required: string;\`
                : &dash;

        `);
    });

    it("should render extended interface (noinherit)", () => {
        expect.assertions(1);
        const item = findInterface("Bar")!;
        const result = renderInterface().properties(item, {
            inherit: false,
        });
        expect(result).toMatchInlineSnapshot(`
            \`documented: string;\`
            : Overridden documentation.

        `);
    });
});
