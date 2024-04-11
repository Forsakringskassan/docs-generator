import fs from "node:fs";
import path from "node:path";
import { generateCode } from "./generate-code";

const fixturePath = path.join(__dirname, "__fixtures__");
const filename = "MockExample.vue";
const slug = "mock-example";
const fingerprint = "123456";
const setupPath = "/path/to/setup.ts";

const fixture = fs.readFileSync(path.join(fixturePath, filename), "utf-8");

it("should generate markup", () => {
    expect.assertions(1);
    const { markup } = generateCode({
        filename,
        slug,
        fingerprint,
        setupPath,
        code: fixture,
    });
    expect(markup).toMatchSnapshot();
});

it("should generate compiled SFC", () => {
    expect.assertions(1);
    const { sourcecode } = generateCode({
        filename,
        slug,
        fingerprint,
        setupPath,
        code: fixture,
    });
    expect(sourcecode).toMatchSnapshot();
});
