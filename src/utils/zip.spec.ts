import { expect, it } from "vitest";
import { zip } from "./zip";

it("should zip two arrays together", () => {
    expect.assertions(1);
    const a = ["a", "b", "c"];
    const b = [1, 2, 3];
    const it = zip(a, b);
    expect(Array.from(it)).toEqual([
        ["a", 1],
        ["b", 2],
        ["c", 3],
    ]);
});

it("should zip two iterators together", () => {
    expect.assertions(1);
    const a = ["a", "b", "c"].values();
    const b = [1, 2, 3].values();
    const it = zip(a, b);
    expect(Array.from(it)).toEqual([
        ["a", 1],
        ["b", 2],
        ["c", 3],
    ]);
});

it("should handle array of different lengths", () => {
    expect.assertions(1);
    const a = ["a", "b", "c"];
    const b = [1, 2];
    const it = zip(a, b);
    expect(Array.from(it)).toEqual([
        ["a", 1],
        ["b", 2],
    ]);
});

it("should handle iterators of different lengths", () => {
    expect.assertions(1);
    const a = ["a", "b"].values();
    const b = [1, 2, 3].values();
    const it = zip(a, b);
    expect(Array.from(it)).toEqual([
        ["a", 1],
        ["b", 2],
    ]);
});
