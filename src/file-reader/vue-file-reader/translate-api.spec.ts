import path from "node:path";
import { translateAPI } from "./translate-api";

function fixture(filename: string): string {
    return path.join(__dirname, "__fixtures__", filename);
}

describe("options API", () => {
    it("should parse dummy javascript component", async () => {
        expect.assertions(1);
        const filepath = fixture("options-dummy-js.vue");
        const result = await translateAPI(filepath);
        expect(result).toEqual({
            name: "options-dummy-js",
            slug: "options-dummy-js",
            events: [],
            props: [],
            slots: [],
        });
    });

    it("should parse dummy typescript component", async () => {
        expect.assertions(1);
        const filepath = fixture("options-dummy-ts.vue");
        const result = await translateAPI(filepath);
        expect(result).toEqual({
            name: "options-dummy-ts",
            slug: "options-dummy-ts",
            events: [],
            props: [],
            slots: [],
        });
    });

    it("should parse props", async () => {
        expect.assertions(1);
        const filepath = fixture("options-props.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "foo",
                type: "string",
                required: false,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "bar",
                type: "number",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "baz",
                type: "{ name: string }",
                required: false,
                description: "Lorem ipsum dolor\nsit amet.",
                default: { value: expect.stringMatching("function()") },
                deprecated: null,
            },
            {
                name: "obsolete",
                type: "string",
                required: false,
                description: null,
                default: { value: `""` },
                deprecated: "Use `foo` instead",
            },
        ]);
    });

    it("should parse events (string)", async () => {
        expect.assertions(1);
        const filepath = fixture("options-emits-string.vue");
        const result = await translateAPI(filepath);
        expect(result.events).toEqual([
            {
                name: "foo",
                description: "Lorem ipsum",
                properties: [],
                deprecated: null,
            },
            {
                name: "bar",
                description: "dolor sit amet",
                properties: [],
                deprecated: null,
            },
            {
                name: "obsolete",
                description: null,
                properties: [],
                deprecated: "Use `foo` instead",
            },
        ]);
    });

    it("should parse events (object)", async () => {
        expect.assertions(1);
        const filepath = fixture("options-emits-object.vue");
        const result = await translateAPI(filepath);
        expect(result.events).toEqual([
            {
                name: "foo",
                description: "Lorem ipsum",
                properties: [
                    {
                        name: "name",
                        type: undefined,
                        description: `dolor sit amet`,
                    },
                ],
                deprecated: null,
            },
            {
                name: "bar",
                description: null,
                properties: [],
                deprecated: null,
            },
        ]);
    });
});

describe("composition API", () => {
    it("should parse dummy javascript component", async () => {
        expect.assertions(1);
        const filepath = fixture("composition-dummy-js.vue");
        const result = await translateAPI(filepath);
        expect(result).toEqual({
            name: "composition-dummy-js",
            slug: "composition-dummy-js",
            events: [],
            props: [],
            slots: [],
        });
    });

    it("should parse dummy typescript component", async () => {
        expect.assertions(1);
        const filepath = fixture("composition-dummy-ts.vue");
        const result = await translateAPI(filepath);
        expect(result).toEqual({
            name: "composition-dummy-ts",
            slug: "composition-dummy-ts",
            events: [],
            props: [],
            slots: [],
        });
    });

    it("should parse object props", async () => {
        expect.assertions(1);
        const filepath = fixture("composition-props-object.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "foo",
                type: "string",
                required: false,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "bar",
                type: "number",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "baz",
                type: "{ name: string }",
                required: false,
                description: "Lorem ipsum dolor\nsit amet.",
                default: { value: expect.stringMatching("function()") },
                deprecated: null,
            },
            {
                name: "obsolete",
                type: "string",
                required: false,
                description: null,
                default: { value: `""` },
                deprecated: "Use `foo` instead",
            },
        ]);
    });

    it("should parse type props", async () => {
        expect.assertions(1);
        const filepath = fixture("composition-props-type.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "foo",
                type: "string",
                required: false,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "bar",
                type: "number",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "baz",
                type: "{ name: string }",
                required: false,
                description: "Lorem ipsum dolor\nsit amet.",
                default: null,
                deprecated: null,
            },
            {
                name: "obsolete",
                type: "string",
                required: false,
                description: null,
                default: null,
                deprecated: "Use `foo` instead",
            },
        ]);
    });

    it("should parse type props with interface", async () => {
        expect.assertions(1);
        const filepath = fixture("composition-props-interface.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "foo",
                type: "string",
                required: false,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "bar",
                type: "number",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "baz",
                type: "{ name: string }",
                required: false,
                description: "Lorem ipsum dolor\nsit amet.",
                default: null,
                deprecated: null,
            },
            {
                name: "obsolete",
                type: "string",
                required: false,
                description: null,
                default: null,
                deprecated: "Use `foo` instead",
            },
        ]);
    });

    it("should parse type props with defaults", async () => {
        expect.assertions(1);
        const filepath = fixture("composition-props-defaults.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "foo",
                type: "string",
                required: false,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "bar",
                type: "number",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "baz",
                type: "{ name: string }",
                required: false,
                description: "Lorem ipsum dolor\nsit amet.",
                default: { value: expect.stringMatching("() => ") },
                deprecated: null,
            },
        ]);
    });

    it("should parse events (string)", async () => {
        expect.assertions(1);
        const filepath = fixture("composition-emits-string.vue");
        const result = await translateAPI(filepath);
        expect(result.events).toEqual([
            {
                name: "foo",
                description: "Lorem ipsum",
                properties: [],
                deprecated: null,
            },
            {
                name: "bar",
                description: null,
                properties: [],
                deprecated: null,
            },
            {
                name: "obsolete",
                description: null,
                properties: [],
                deprecated: "Use `foo` instead",
            },
        ]);
    });

    /* eslint-disable-next-line jest/no-disabled-tests -- vue-docgen-api fails to recognize this */
    it.skip("should parse events (object)", async () => {
        expect.assertions(1);
        const filepath = fixture("composition-emits-object.vue");
        const result = await translateAPI(filepath);
        expect(result.events).toEqual([
            {
                name: "foo",
                description: "Lorem ipsum",
                properties: `name: undefined &#8212; dolor sit amet`,
                deprecated: null,
            },
            {
                name: "bar",
                description: "",
                properties: [],
                deprecated: null,
            },
            {
                name: "obsolete",
                description: "",
                properties: [],
                deprecated: "Use `foo` instead",
            },
        ]);
    });

    it("should parse events (type)", async () => {
        expect.assertions(1);
        const filepath = fixture("composition-emits-type.vue");
        const result = await translateAPI(filepath);
        expect(result.events).toEqual([
            {
                name: "foo",
                description: "Lorem ipsum",
                properties: [
                    {
                        name: "name",
                        type: "string",
                        description: `dolor sit amet`,
                    },
                ],
                deprecated: null,
            },
            {
                name: "bar",
                description: null,
                properties: [],
                deprecated: null,
            },
            {
                name: "obsolete",
                description: null,
                properties: [],
                deprecated: "Use `foo` instead",
            },
        ]);
    });

    it("should parse events (interface)", async () => {
        expect.assertions(1);
        const filepath = fixture("composition-emits-interface.vue");
        const result = await translateAPI(filepath);
        expect(result.events).toEqual([
            {
                name: "foo",
                description: "Lorem ipsum",
                properties: [
                    {
                        name: "name",
                        type: "string",
                        description: `dolor sit amet`,
                    },
                ],
                deprecated: null,
            },
            {
                name: "bar",
                description: null,
                properties: [],
                deprecated: null,
            },
            {
                name: "obsolete",
                description: null,
                properties: [],
                deprecated: "Use `foo` instead",
            },
        ]);
    });
});

it("should handle v-model with @model", async () => {
    expect.assertions(1);
    const filepath = fixture("options-vmodel.vue");
    const result = await translateAPI(filepath);
    expect(result.props).toEqual([
        {
            name: "v-model",
            type: "string",
            required: false,
            description: "Lorem ipsum.",
            default: { value: `""` },
            deprecated: null,
        },
    ]);
});

it("should handle v-model with update event", async () => {
    expect.assertions(1);
    const filepath = fixture("options-vmodel-emit.vue");
    const result = await translateAPI(filepath);
    expect(result.props).toEqual([
        {
            name: "v-model",
            type: "string",
            required: false,
            description: "Lorem ipsum.",
            default: { value: `""` },
            deprecated: null,
        },
    ]);
});

it("should handle multiple v-model", async () => {
    expect.assertions(1);
    const filepath = fixture("options-vmodel-multiple.vue");
    const result = await translateAPI(filepath);
    expect(result.props).toEqual([
        {
            name: "v-model",
            type: "string",
            required: false,
            description: "Lorem ipsum.",
            default: { value: `""` },
            deprecated: null,
        },
        {
            name: "v-model:foo",
            type: "number",
            required: false,
            description: null,
            default: { value: `0` },
            deprecated: null,
        },
    ]);
});

it("should handle @ignore", async () => {
    expect.assertions(3);
    const filepath = fixture("ignore.vue");
    const result = await translateAPI(filepath);
    expect(result.props).toEqual([
        {
            name: "foo",
            type: "string",
            required: true,
            description: null,
            default: null,
            deprecated: null,
        },
    ]);
    expect(result.events).toEqual([
        {
            name: "foo",
            description: null,
            deprecated: null,
            properties: [],
        },
    ]);
    expect(result.slots).toEqual([
        {
            name: "foo",
            description: null,
            deprecated: null,
            bindings: [],
        },
    ]);
});
