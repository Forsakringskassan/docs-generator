/* eslint-disable sonarjs/fixme-tag -- false positive */

import path from "node:path";
import { translateAPI } from "./translate-api";

function fixture(filename: string): string {
    return path.join(__dirname, "__fixtures__", filename);
}

describe("options API", () => {
    it("should parse dummy javascript component", async () => {
        expect.assertions(1);
        const filepath = fixture("OptionsDummyJs.vue");
        const result = await translateAPI(filepath);
        expect(result).toEqual({
            name: "OptionsDummyJs",
            slug: "optionsdummyjs",
            models: [],
            events: [],
            props: [],
            slots: [],
        });
    });

    it("should parse dummy typescript component", async () => {
        expect.assertions(1);
        const filepath = fixture("OptionsDummyTs.vue");
        const result = await translateAPI(filepath);
        expect(result).toEqual({
            name: "OptionsDummyTs",
            slug: "optionsdummyts",
            models: [],
            events: [],
            props: [],
            slots: [],
        });
    });

    it("should handle v-model with update event", async () => {
        expect.assertions(3);
        const filepath = fixture("OptionsVmodelEmit.vue");
        const result = await translateAPI(filepath);
        expect(result.models).toEqual([
            {
                name: "v-model",
                type: "string",
                required: false,
                description: "Lorem ipsum.",
                default: { value: `""` },
                deprecated: null,
            },
        ]);
        expect(result.props).toEqual([]);
        expect(result.events).toEqual([]);
    });

    it("should handle multiple v-model", async () => {
        expect.assertions(3);
        const filepath = fixture("OptionsVmodelMultiple.vue");
        const result = await translateAPI(filepath);
        expect(result.models).toEqual([
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
        expect(result.props).toEqual([]);
        expect(result.events).toEqual([]);
    });

    it("should parse props", async () => {
        expect.assertions(1);
        const filepath = fixture("OptionsProps.vue");
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

    /* eslint-disable-next-line jest/no-disabled-tests -- known bug */
    it.skip("should parse enum prop", async () => {
        expect.assertions(1);
        const filepath = fixture("OptionsPropsEnum.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "value",
                type: "'foo' | 'bar' | 'baz'",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
        ]);
    });

    it("should parse array props", async () => {
        expect.assertions(1);
        const filepath = fixture("OptionsPropsArray.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "stringArray",
                type: "string[]",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "inlineArray",
                type: "Array<{ foo: string }>",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "localArray",
                type: "LocalFoo[]",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "externalArray",
                type: "ExternalFoo[]",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "untypedArray",
                type: "array",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
        ]);
    });

    it("should parse union props", async () => {
        expect.assertions(1);
        const filepath = fixture("OptionsPropsUnion.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "types",
                type: "string | number",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "enumeration",
                type: '"active" | "inactive" | "pending"',
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "complex",
                type: '{ foo: "spam" } | { foo: "ham" }',
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
        ]);
    });

    it("should parse events (string)", async () => {
        expect.assertions(1);
        const filepath = fixture("OptionsEmitsString.vue");
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
        const filepath = fixture("OptionsEmitsObject.vue");
        const result = await translateAPI(filepath);
        expect(result.events).toEqual([
            {
                name: "foo",
                description: "Lorem ipsum",
                properties: [
                    {
                        name: "name",
                        type: "mixed",
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

    it("should parse slots", async () => {
        expect.assertions(1);
        const filepath = fixture("OptionsSlots.vue");
        const result = await translateAPI(filepath);
        expect(result.slots).toEqual([
            {
                name: "default",
                description: "Lorem default ipsum",
                bindings: [],
                deprecated: null,
            },
            {
                name: "foo",
                description: "Lorem foo ipsum",
                bindings: [
                    {
                        name: "item",
                        type: "string",
                        description: "Item description",
                    },
                    {
                        name: "index",
                        type: "number",
                        description: "Index description",
                    },
                ],
                deprecated: null,
            },
            {
                name: "bar",
                /* eslint-disable-next-line no-warning-comments -- bug in vue-docgen-api */
                description: "Lorem default ipsum", // FIXME
                bindings: [],
                deprecated: null,
            },
        ]);
    });
});

describe("composition API", () => {
    it("should parse dummy javascript component", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionDummyJs.vue");
        const result = await translateAPI(filepath);
        expect(result).toEqual({
            name: "CompositionDummyJs",
            slug: "compositiondummyjs",
            models: [],
            events: [],
            props: [],
            slots: [],
        });
    });

    it("should parse dummy typescript component", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionDummyTs.vue");
        const result = await translateAPI(filepath);
        expect(result).toEqual({
            name: "CompositionDummyTs",
            slug: "compositiondummyts",
            models: [],
            events: [],
            props: [],
            slots: [],
        });
    });

    it("should handle v-model with update event", async () => {
        expect.assertions(3);
        const filepath = fixture("CompositionVmodelEmit.vue");
        const result = await translateAPI(filepath);
        expect(result.models).toEqual([
            {
                name: "v-model",
                type: "string",
                required: false,
                description: "Lorem ipsum.",
                default: { value: `""` },
                deprecated: null,
            },
        ]);
        expect(result.props).toEqual([]);
        expect(result.events).toEqual([]);
    });

    it("should handle multiple v-model", async () => {
        expect.assertions(3);
        const filepath = fixture("OptionsVmodelMultiple.vue");
        const result = await translateAPI(filepath);
        expect(result.models).toEqual([
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
        expect(result.props).toEqual([]);
        expect(result.events).toEqual([]);
    });

    /* eslint-disable-next-line jest/no-disabled-tests -- vue-docgen-api fails to recognize this */
    it.skip("should handle v-model with `defineModel`", async () => {
        expect.assertions(3);
        const filepath = fixture("CompositionVmodelDefine.vue");
        const result = await translateAPI(filepath);
        expect(result.models).toEqual([
            {
                name: "v-model",
                type: "string",
                required: false,
                description: "Lorem ipsum.",
                default: { value: `""` },
                deprecated: null,
            },
        ]);
        expect(result.props).toEqual([]);
        expect(result.events).toEqual([]);
    });

    it("should parse object props", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionPropsObject.vue");
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
        const filepath = fixture("CompositionPropsType.vue");
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
        const filepath = fixture("CompositionPropsInterface.vue");
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

    it("should parse array props", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionPropsArray.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "stringArray",
                type: "string[]",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "inlineArray",
                type: "Array<{ foo: string }>",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "localArray",
                type: "LocalFoo[]",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "externalArray",
                type: "ExternalFoo[]",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "untypedArray",
                type: "any[]",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
        ]);
    });

    it("should parse tuple props", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionPropsTuple.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "emptyTuple",
                type: "[]",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "singleElementTuple",
                type: "[number]",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "multipleElementTuple",
                type: "[string, number]",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
        ]);
    });

    it("should parse union props", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionPropsUnion.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "types",
                type: "string | number",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "enumeration",
                type: '"active" | "inactive" | "pending"',
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
            {
                name: "complex",
                type: '{ foo: "spam" } | { foo: "ham" }',
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
        ]);
    });

    /* eslint-disable-next-line jest/no-disabled-tests -- known bug */
    it.skip("should parse enum prop", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionPropsEnum.vue");
        const result = await translateAPI(filepath);
        expect(result.props).toEqual([
            {
                name: "value",
                type: "'foo' | 'bar' | 'baz'",
                required: true,
                description: null,
                default: null,
                deprecated: null,
            },
        ]);
    });

    it("should parse type props with defaults", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionPropsDefaults.vue");
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

    /* eslint-disable-next-line jest/no-disabled-tests -- vue-docgen-api fails to recognize this */
    it.skip("should parse type props with props destructuring", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionPropsDestructuring.vue");
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
                default: { value: "42" },
                deprecated: null,
            },
        ]);
    });

    it("should parse events (string)", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionEmitsString.vue");
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
        const filepath = fixture("CompositionEmitsObject.vue");
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
        const filepath = fixture("CompositionEmitsType.vue");
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
        const filepath = fixture("CompositionEmitsInterface.vue");
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

    it("should parse slots (template)", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionSlotsTemplate.vue");
        const result = await translateAPI(filepath);
        expect(result.slots).toEqual([
            {
                name: "default",
                description: "Lorem default ipsum",
                bindings: [],
                deprecated: null,
            },
            {
                name: "foo",
                description: "Lorem foo ipsum",
                bindings: [
                    {
                        name: "item",
                        type: "string",
                        description: "Item description",
                    },
                    {
                        name: "index",
                        type: "number",
                        description: "Index description",
                    },
                ],
                deprecated: null,
            },
            {
                name: "bar",
                /* eslint-disable-next-line no-warning-comments -- bug in vue-docgen-api */
                description: "Lorem default ipsum", // FIXME
                bindings: [],
                deprecated: null,
            },
        ]);
    });

    it("should parse slots (defineSlots)", async () => {
        expect.assertions(1);
        const filepath = fixture("CompositionSlotsDefineslots.vue");
        const result = await translateAPI(filepath);
        expect(result.slots).toEqual([
            {
                name: "default",
                description: "Lorem default ipsum",
                bindings: [],
                deprecated: null,
            },
            {
                name: "foo",
                description: "Lorem foo ipsum",
                bindings: [
                    {
                        name: "item",
                        type: "unknown",
                        description: "Item description",
                    },
                    {
                        name: "index",
                        type: "unknown",
                        description: "Index description",
                    },
                ],
                deprecated: null,
            },
            {
                name: "bar",
                description: null,
                bindings: [],
                deprecated: null,
            },
        ]);
    });
});

it("should handle @ignore", async () => {
    expect.assertions(3);
    const filepath = fixture("Ignore.vue");
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
