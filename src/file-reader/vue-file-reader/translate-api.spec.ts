import path from "node:path";
import { translateAPI } from "./translate-api";

const HYPHEN = "&#8208;";

function fixture(filename: string): string {
    return path.join(__dirname, "__fixtures__", filename);
}

describe("options API", () => {
    it("should parse dummy javascript component", async () => {
        expect.assertions(1);
        const filepath = fixture("options-dummy-js.vue");
        const result = await translateAPI(filepath);
        expect(result).toEqual({
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
                required: "false",
                description: HYPHEN,
                default: HYPHEN,
            },
            {
                name: "bar",
                type: "number",
                required: "true",
                description: HYPHEN,
                default: HYPHEN,
            },
            {
                name: "baz",
                type: "{ name: string }",
                required: "false",
                description: "Lorem ipsum dolor\nsit amet.",
                default: expect.stringMatching("function()"),
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
                properties: HYPHEN,
            },
            {
                name: "bar",
                description: "dolor sit amet",
                properties: HYPHEN,
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
                properties: `name: undefined &#8212; dolor sit amet`,
            },
            {
                name: "bar",
                description: HYPHEN,
                properties: HYPHEN,
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
                required: "false",
                description: HYPHEN,
                default: HYPHEN,
            },
            {
                name: "bar",
                type: "number",
                required: "true",
                description: HYPHEN,
                default: HYPHEN,
            },
            {
                name: "baz",
                type: "{ name: string }",
                required: "false",
                description: "Lorem ipsum dolor\nsit amet.",
                default: expect.stringMatching("function()"),
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
                required: "false",
                description: HYPHEN,
                default: HYPHEN,
            },
            {
                name: "bar",
                type: "number",
                required: "true",
                description: HYPHEN,
                default: HYPHEN,
            },
            {
                name: "baz",
                type: "{ name: string }",
                required: "false",
                description: "Lorem ipsum dolor\nsit amet.",
                default: HYPHEN,
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
                required: "false",
                description: HYPHEN,
                default: HYPHEN,
            },
            {
                name: "bar",
                type: "number",
                required: "true",
                description: HYPHEN,
                default: HYPHEN,
            },
            {
                name: "baz",
                type: "{ name: string }",
                required: "false",
                description: "Lorem ipsum dolor\nsit amet.",
                default: HYPHEN,
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
                required: "false",
                description: HYPHEN,
                default: HYPHEN,
            },
            {
                name: "bar",
                type: "number",
                required: "true",
                description: HYPHEN,
                default: HYPHEN,
            },
            {
                name: "baz",
                type: "{ name: string }",
                required: "false",
                description: "Lorem ipsum dolor\nsit amet.",
                default: expect.stringMatching("() => "),
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
                properties: HYPHEN,
            },
            {
                name: "bar",
                description: HYPHEN,
                properties: HYPHEN,
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
            },
            {
                name: "bar",
                description: HYPHEN,
                properties: HYPHEN,
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
                properties: `name: string &#8212; dolor sit amet`,
            },
            {
                name: "bar",
                description: HYPHEN,
                properties: HYPHEN,
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
                properties: `name: string &#8212; dolor sit amet`,
            },
            {
                name: "bar",
                description: HYPHEN,
                properties: HYPHEN,
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
            required: "false",
            description: "Lorem ipsum.",
            default: `""`,
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
            required: "false",
            description: "Lorem ipsum.",
            default: `""`,
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
            required: "false",
            description: "Lorem ipsum.",
            default: `""`,
        },
        {
            name: "v-model:foo",
            type: "number",
            required: "false",
            description: HYPHEN,
            default: `0`,
        },
    ]);
});
