import { interpolate } from "./interpolate";

it("should interpolate text", () => {
    expect.assertions(1);
    const data = {
        name: "World",
    };
    const message = "Hello {{ name }}!";
    const result = interpolate(message, data);
    expect(result).toBe("Hello World!");
});

it("should multiple keys", () => {
    expect.assertions(1);
    const data = {
        a: "1",
        b: "2",
        c: "3",
    };
    const message = "{{ a }} {{ b }} {{ c }}";
    const result = interpolate(message, data);
    expect(result).toBe("1 2 3");
});

it("should handle missing whitespace around key", () => {
    expect.assertions(1);
    const data = {
        name: "World",
    };
    const message = "Hello {{name}}!";
    const result = interpolate(message, data);
    expect(result).toBe("Hello World!");
});

it("should handle missing key", () => {
    expect.assertions(1);
    const data = {};
    const message = "Hello {{ name }}!";
    const result = interpolate(message, data);
    expect(result).toBe("Hello {{ name }}!");
});

it("should handle extra handlebars", () => {
    expect.assertions(1);
    const data = {
        a: "1",
    };
    const message = "{{{ a }}} {{ { a } }}";
    const result = interpolate(message, data);
    expect(result).toBe("{1} {{ { a } }}");
});
