import path from "node:path";
import { type BuildResult } from "esbuild";
import { Volume } from "memfs";
import { type FSLike, compileScript } from "./compile-script";
import * as esbuildWrapper from "./esbuild-wrapper";

const fingerprint = "b4dc00ffe";

jest.mock("../utils/get-fingerprint", () => {
    return {
        getFingerprint() {
            return fingerprint;
        },
    };
});

let volume: Volume | null = null;

const esbuild = jest
    .spyOn(esbuildWrapper, "esbuild")
    .mockImplementation(async (options) => {
        if (!volume) {
            throw new Error("esbuild mock missing fs volume");
        }
        if (!options.outfile) {
            throw new Error("esbuild mock missing options.outfile");
        }

        await volume.promises.mkdir(path.dirname(options.outfile), {
            recursive: true,
        });
        await volume.promises.writeFile(
            options.outfile,
            "mock compiled content",
            { encoding: "utf-8" },
        );

        /* this will blow up if compileScript try to use the result */
        return {} as BuildResult;
    });

beforeEach(() => {
    volume = null;
    jest.clearAllMocks();
});

it("should compile and create asset in assets folder", async () => {
    expect.assertions(3);
    volume = Volume.fromJSON({});
    const result = await compileScript({
        assetFolder: "public/assets",
        name: "asset-name",
        src: "src/my-file.ts",
        buildOptions: {},
        assets: [],
        vendor: [],
        fs: volume.promises as unknown as FSLike,
    });
    const expectedFilename = `asset-name-${fingerprint}.js`;
    const expectedPublicPath = `./assets/${expectedFilename}`;
    const expectedFilePath = `public/assets/${expectedFilename}`;
    expect(result.filename).toBe(expectedFilename);
    expect(result.publicPath).toBe(expectedPublicPath);
    expect(volume.existsSync(expectedFilePath)).toBeTruthy();
});

it("should set assets and vendor libraries as external", async () => {
    expect.assertions(1);
    volume = Volume.fromJSON({});
    await compileScript({
        assetFolder: "public/assets",
        name: "asset-name",
        src: "src/my-file.ts",
        assets: ["baz"],
        vendor: ["foo", { package: "bar" }],
        buildOptions: {},
        fs: volume.promises as unknown as FSLike,
    });
    expect(esbuild).toHaveBeenCalledWith(
        expect.objectContaining({
            external: ["baz", "foo", "bar"],
        }),
    );
});

it("should set additional build options", async () => {
    expect.assertions(1);
    volume = Volume.fromJSON({});
    await compileScript({
        assetFolder: "public/assets",
        name: "asset-name",
        src: "src/my-file.ts",
        assets: [],
        vendor: [],
        buildOptions: {
            logLevel: "info",
            define: {
                foo: "bar",
            },
        },
        fs: volume.promises as unknown as FSLike,
    });
    expect(esbuild).toHaveBeenCalledWith(
        expect.objectContaining({
            logLevel: "info",
            define: expect.objectContaining({
                foo: "bar",
            }),
        }),
    );
});
