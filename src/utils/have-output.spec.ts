import { type FileInfo } from "../document";
import { haveOutput } from "./have-output";

it("should return true if document have outputName", () => {
    expect.assertions(1);
    const fileInfo: FileInfo = {
        path: "",
        name: "",
        fullPath: "",
        outputName: "foobar.html",
    };
    expect(haveOutput({ fileInfo })).toBeTruthy();
});

it("should return false if document have no outputName", () => {
    expect.assertions(1);
    const fileInfo: FileInfo = {
        path: "",
        name: "",
        fullPath: "",
        outputName: false,
    };
    expect(haveOutput({ fileInfo })).toBeFalsy();
});
