import { serializeAttrs } from "./serialize-attrs";

it("should serialize string", () => {
    expect.assertions(1);
    const attrs = Array.from(serializeAttrs({ foo: "bar" }));
    expect(attrs).toEqual(['foo="bar"']);
});

it("should serialize number", () => {
    expect.assertions(1);
    const attrs = Array.from(serializeAttrs({ foo: 12 }));
    expect(attrs).toEqual(['foo="12"']);
});

it("should serialize boolean", () => {
    expect.assertions(1);
    const attrs = Array.from(serializeAttrs({ foo: true, bar: false }));
    expect(attrs).toEqual(["foo"]);
});

it("should serialize null", () => {
    expect.assertions(1);
    const attrs = Array.from(serializeAttrs({ foo: null }));
    expect(attrs).toEqual([]);
});

it("should serialize nested object", () => {
    expect.assertions(1);
    const attrs = Array.from(
        serializeAttrs({
            data: {
                foo: "bar",
                spam: {
                    ham: 12,
                },
            },
        }),
    );
    expect(attrs).toEqual(['data-foo="bar"', 'data-spam-ham="12"']);
});

it("should encode quotes", () => {
    expect.assertions(1);
    const attrs = Array.from(serializeAttrs({ foo: '"bar"' }));
    expect(attrs).toEqual(['foo="&quot;bar&quot;"']);
});
