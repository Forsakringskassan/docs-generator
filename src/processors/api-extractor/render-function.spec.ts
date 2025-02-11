import { existsSync } from "node:fs";
import {
    ApiFunction,
    ApiItem,
    ApiItemKind,
    ApiModel,
} from "@microsoft/api-extractor-model";
import {
    renderPrototype,
    renderParameters,
    renderReturnvalue,
} from "./render-function";

const fixture = "temp/docs.api.json";

if (!existsSync(fixture)) {
    throw new Error(
        `Fixture "${fixture}" does not exist, make sure the project is built with "npm run build" before running this test suite!`,
    );
}

expect.addSnapshotSerializer({
    test() {
        return true;
    },
    serialize(value: string) {
        return value;
    },
});

const apiModel = new ApiModel();
const apiPackage = apiModel.loadPackage(fixture);
const entrypoint = apiPackage.findMembersByName("")[0];

function isApiFunction(item: ApiItem): item is ApiFunction {
    return item.kind === ApiItemKind.Function;
}

function findFunction(name: string): ApiFunction | undefined {
    return entrypoint.members
        .filter(isApiFunction)
        .find((it) => it.name === name);
}

it("should render function prototype", () => {
    expect.assertions(1);
    const item = findFunction("exampleFunction")!;
    const output = renderPrototype(item);
    expect(output).toMatchInlineSnapshot(`
        \`\`\`ts nocompile nolint
        function exampleFunction(a: number, b: number, c?: number): number;
        \`\`\`
    `);
});

it("should render function parameters", () => {
    expect.assertions(1);
    const item = findFunction("exampleFunction")!;
    const output = renderParameters(item);
    expect(output).toMatchInlineSnapshot(`
        \`a: number\`
        : First number to add.

        \`b: number\`
        : Second number to add.

        \`c: number\` {@optional}
        : Optional third number to add.

    `);
});

it("should render function return value", () => {
    expect.assertions(1);
    const item = findFunction("exampleFunction")!;
    const output = renderReturnvalue(item);
    expect(output).toMatchInlineSnapshot(`The sum of the numbers.`);
});
