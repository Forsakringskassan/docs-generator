import { expect, it, vi } from "vitest";
import { memoize } from "./memoize";

it("should return the result of the callback", () => {
    expect.assertions(1);
    const spy = vi.fn(() => 12);
    const fn = memoize(spy);
    const result = fn();
    expect(result).toBe(12);
});

it("should only evaluate callback once", () => {
    expect.assertions(2);
    const spy = vi.fn(() => 42);
    const fn = memoize(spy);
    const result1 = fn();
    const result2 = fn();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(result2);
});

it("should be lazy evaluated", () => {
    expect.assertions(1);
    const spy = vi.fn(() => 12);
    memoize(spy);
    expect(spy).toHaveBeenCalledTimes(0);
});

it("should handle different arguments", () => {
    expect.assertions(7);
    const spy = vi.fn((n: number) => n * 2);
    const fn = memoize(spy);
    const result1 = fn(1);
    const result2 = fn(2);
    const result3 = fn(1);
    const result4 = fn(2);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalledWith(2);
    expect(result1).toBe(2);
    expect(result2).toBe(4);
    expect(result3).toEqual(result1);
    expect(result4).toEqual(result2);
});

it("should handle async callbacks", async () => {
    expect.assertions(2);
    const spy = vi.fn(() => Promise.resolve(12));
    const fn = memoize(spy);
    const result1 = await fn();
    const result2 = await fn();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(result2);
});

it("should handle falsy return values", () => {
    expect.assertions(8);
    for (const value of [0, false, null, undefined]) {
        const spy = vi.fn(() => value);
        const fn = memoize(spy);
        const result1 = fn();
        const result2 = fn();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result1).toEqual(result2);
    }
});
