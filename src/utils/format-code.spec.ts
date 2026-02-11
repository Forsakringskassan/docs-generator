import { formatCode } from "./format-code";

expect.addSnapshotSerializer({
    test() {
        return true;
    },
    serialize(value: unknown) {
        return String(value);
    },
});

describe("formatCode()", () => {
    it("should format code", () => {
        const original = `const foo=1; const bar    =   2;`;
        const formatted = formatCode(original, "foo.ts");
        expect(formatted).toMatchInlineSnapshot(`
            const foo = 1;
            const bar = 2;
        `);
    });
});
