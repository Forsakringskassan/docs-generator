import fs from "node:fs";
import path from "node:path";
import { type ExampleOptions, generateCode } from "./generate-code";

const fixturePath = path.join(__dirname, "__fixtures__");

function readFixture(filename: string): ExampleOptions {
    const slug = filename
        .replace(".vue", "")
        .replace(/(^|.)([A-Z])/g, (_, p1: string, p2: string) => {
            return `${p1}${p1 ? "-" : ""}${p2.toLowerCase()}`;
        });
    const fingerprint = "123456";
    const setupPath = "/path/to/setup.ts";
    const fixture = fs.readFileSync(path.join(fixturePath, filename), "utf-8");
    return {
        filename,
        slug,
        fingerprint,
        setupPath,
        code: fixture,
    };
}

it("should generate markup", () => {
    expect.assertions(1);
    const { markup } = generateCode(readFixture("MockExample.vue"));
    expect(markup).toMatchSnapshot();
});

it("should generate compiled SFC", () => {
    expect.assertions(1);
    const { sourcecode } = generateCode(readFixture("MockExample.vue"));
    expect(sourcecode).toMatchSnapshot();
});

it("should handle missing <script>", () => {
    expect.assertions(1);
    const { sourcecode } = generateCode(readFixture("NoScript.vue"));
    expect(sourcecode).toMatchSnapshot();
});
