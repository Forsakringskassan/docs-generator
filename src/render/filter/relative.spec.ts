import { relative } from "./relative";

it("should return relative url to parent page", () => {
    expect.assertions(1);
    const url = "./foo/destination.html";
    const doc = { fileInfo: { path: "./foo/bar" } };
    expect(relative(url, doc)).toBe("../destination.html");
});

it("should return relative url to sibling folder", () => {
    expect.assertions(1);
    const url = "./foo/destination.html";
    const doc = { fileInfo: { path: "./bar" } };
    expect(relative(url, doc)).toBe("../foo/destination.html");
});

it("should return relative url to in same folder", () => {
    expect.assertions(1);
    const url = "./foo/destination.html";
    const doc = { fileInfo: { path: "./foo" } };
    expect(relative(url, doc)).toBe("./destination.html");
});

it("should handle when url has leading slash", () => {
    expect.assertions(1);
    const url = "/foo/destination.html";
    const doc = { fileInfo: { path: "./bar" } };
    expect(relative(url, doc)).toBe("../foo/destination.html");
});

it("should handle when url is the same as the current path", () => {
    expect.assertions(2);
    const url = ["./foo", "./foo/"];
    const doc = { fileInfo: { path: "./foo" } };
    expect(relative(url[0], doc)).toBe("./");
    expect(relative(url[1], doc)).toBe("./");
});

it("should return url as-is when url is external", () => {
    expect.assertions(3);
    /* eslint-disable-next-line sonarjs/no-clear-text-protocols -- to ensure that any of them works */
    const url = ["http://example.net", "https://example.net", "//example.net"];
    const doc = { fileInfo: { path: "./foo" } };
    expect(relative(url[0], doc)).toBe(url[0]);
    expect(relative(url[1], doc)).toBe(url[1]);
    expect(relative(url[2], doc)).toBe(url[2]);
});

it("should retain trailing slash if url has one", () => {
    expect.assertions(2);
    const url = ["/foo/destination", "/foo/destination/"];
    const doc = { fileInfo: { path: "./bar" } };
    expect(relative(url[0], doc)).toBe("../foo/destination");
    expect(relative(url[1], doc)).toBe("../foo/destination/");
});
