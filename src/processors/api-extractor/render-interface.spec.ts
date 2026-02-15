/* eslint-disable jest/no-large-snapshots -- keeps test and expected results better together */

import path from "node:path";
import {
    type ApiInterface,
    type ApiItem,
    ApiItemKind,
    ApiModel,
} from "@microsoft/api-extractor-model";
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
    serialize(value) {
        return String(value);
    },
});

function isApiFunction(item: ApiItem): item is ApiInterface {
    return item.kind === ApiItemKind.Interface;
}

function findInterface(name: string): ApiInterface | undefined {
    return entrypoint.members
        .filter(isApiFunction)
        .find((it) => it.name === name);
}

it("should render interface (interface)", () => {
    expect.assertions(1);
    const item = findInterface("Foo")!;
    const result = variant.interface(item);
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

it("should render interface (properties)", () => {
    expect.assertions(1);
    const item = findInterface("Foo")!;
    const result = variant.properties(item);
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
