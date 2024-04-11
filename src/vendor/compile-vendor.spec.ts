import { getAssetSource } from "./compile-vendor";

describe("getAssetSource()", () => {
    it("should return asset source", () => {
        expect.assertions(1);
        const result = getAssetSource(
            {
                package: "@fkui/logic",
                global: undefined,
                expose: "named",
                subpaths: [],
            },
            "mockFunction()",
        );
        expect(result).toMatchSnapshot();
    });

    it("should return asset source with alias", () => {
        expect.assertions(1);
        const result = getAssetSource(
            {
                package: "vue",
                global: undefined,
                expose: "named",
                subpaths: [],
                alias: "vue/dist/vue.esm-bundler.js",
            },
            "mockFunction()",
        );
        expect(result).toMatchSnapshot();
    });
});
