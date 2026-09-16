import { expect, it } from "vitest";
import { takeWhile } from "./take-while";

function isEven(value: number): boolean {
    return value % 2 === 0;
}

it("should yield values from array until predicate is false", () => {
    expect.assertions(1);
    const values = [2, 4, 5, 6];
    const result = takeWhile(values, isEven);
    expect(Array.from(result)).toEqual([2, 4]);
});

it("should yield values from iterator until predicate is false", () => {
    expect.assertions(1);
    const values = [2, 4, 5, 6].values();
    const result = takeWhile(values, isEven);
    expect(Array.from(result)).toEqual([2, 4]);
});
