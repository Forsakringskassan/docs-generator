import { type Generator } from "./generator";
import { compileProcessorRuntime } from "./compile-processor-runtime";

const docs: Pick<Generator, "compileScript"> = {
    compileScript() {
        /* do nothing */
    },
};

const compileScript = jest.spyOn(docs, "compileScript");

beforeEach(() => {
    compileScript.mockReset();
});

it("should queue runtime scripts for compilation", () => {
    expect.assertions(2);
    compileProcessorRuntime(docs, `file://${__filename}`, [
        {
            name: "foo",
            before: "assets",
            runtime: [{ src: "foo.js" }],
            handler() {
                /* do nothing */
            },
        },
    ]);
    expect(compileScript).toHaveBeenCalledTimes(1);
    expect(compileScript).toHaveBeenCalledWith(
        "processors/foo/foo",
        "foo.js",
        {
            appendTo: "body",
            priority: expect.any(Number),
        },
        {},
    );
});

it("should handle multiple scripts from same processor", () => {
    expect.assertions(3);
    compileProcessorRuntime(docs, `file://${__filename}`, [
        {
            name: "foo",
            before: "assets",
            runtime: [{ src: "foo.js" }, { src: "bar.js" }],
            handler() {
                /* do nothing */
            },
        },
    ]);
    expect(compileScript).toHaveBeenCalledTimes(2);
    expect(compileScript).toHaveBeenCalledWith(
        "processors/foo/foo",
        "foo.js",
        {
            appendTo: "body",
            priority: expect.any(Number),
        },
        {},
    );
    expect(compileScript).toHaveBeenCalledWith(
        "processors/foo/bar",
        "bar.js",
        {
            appendTo: "body",
            priority: expect.any(Number),
        },
        {},
    );
});

it("should handle multiple processors with runtime scripts", () => {
    expect.assertions(3);
    compileProcessorRuntime(docs, `file://${__filename}`, [
        {
            name: "foo",
            before: "assets",
            runtime: [{ src: "foo.js" }],
            handler() {
                /* do nothing */
            },
        },
        {
            name: "bar",
            before: "assets",
            runtime: [{ src: "foo.js" }],
            handler() {
                /* do nothing */
            },
        },
    ]);
    expect(compileScript).toHaveBeenCalledTimes(2);
    expect(compileScript).toHaveBeenCalledWith(
        "processors/foo/foo",
        "foo.js",
        {
            appendTo: "body",
            priority: expect.any(Number),
        },
        {},
    );
    expect(compileScript).toHaveBeenCalledWith(
        "processors/bar/foo",
        "foo.js",
        {
            appendTo: "body",
            priority: expect.any(Number),
        },
        {},
    );
});

it("should handle processor without runtime scripts", () => {
    expect.assertions(1);
    compileProcessorRuntime(docs, `file://${__filename}`, [
        {
            name: "foo",
            before: "assets",
            handler() {
                /* do nothing */
            },
        },
        {
            name: "bar",
            before: "assets",
            runtime: [],
            handler() {
                /* do nothing */
            },
        },
    ]);
    expect(compileScript).toHaveBeenCalledTimes(0);
});

it("should not include scripts from disabled processors", () => {
    expect.assertions(1);
    compileProcessorRuntime(docs, `file://${__filename}`, [
        {
            name: "foo",
            enabled: false,
            before: "assets",
            runtime: [{ src: "foo.js" }],
            handler() {
                /* do nothing */
            },
        },
    ]);
    expect(compileScript).toHaveBeenCalledTimes(0);
});

it("should use custom asset name if provided", () => {
    expect.assertions(2);
    compileProcessorRuntime(docs, `file://${__filename}`, [
        {
            name: "foo",
            before: "assets",
            runtime: [{ src: "foo.js", name: "bar" }],
            handler() {
                /* do nothing */
            },
        },
    ]);
    expect(compileScript).toHaveBeenCalledTimes(1);
    expect(compileScript).toHaveBeenCalledWith(
        "processors/foo/bar",
        "foo.js",
        {
            appendTo: "body",
            priority: expect.any(Number),
        },
        {},
    );
});

it("should use custom build options if provided", () => {
    expect.assertions(2);
    compileProcessorRuntime(docs, `file://${__filename}`, [
        {
            name: "foo",
            before: "assets",
            runtime: [
                { src: "foo.js", buildOptions: { define: { foo: "bar" } } },
            ],
            handler() {
                /* do nothing */
            },
        },
    ]);
    expect(compileScript).toHaveBeenCalledTimes(1);
    expect(compileScript).toHaveBeenCalledWith(
        "processors/foo/foo",
        "foo.js",
        {
            appendTo: "body",
            priority: expect.any(Number),
        },
        {
            define: {
                foo: "bar",
            },
        },
    );
});
