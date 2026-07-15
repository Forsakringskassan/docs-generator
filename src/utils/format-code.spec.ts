import { describe, expect, it } from "vitest";
import { formatCode } from "./format-code";

expect.addSnapshotSerializer({
    test() {
        return true;
    },
    serialize: String,
});

describe("formatCode()", () => {
    it("should format code", () => {
        expect.assertions(1);
        const original = `const foo=1; const bar    =   2;`;
        const formatted = formatCode(original, "foo.ts");
        expect(formatted).toMatchInlineSnapshot(`
            const foo = 1;
            const bar = 2;
        `);
    });
});
