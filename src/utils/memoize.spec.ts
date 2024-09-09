import { memoize } from "./memoize";

it("should return the result of the callback", () => {
    expect.assertions(1);
    const spy = jest.fn(() => 12);
    const fn = memoize(spy);
    const result = fn();
    expect(result).toBe(12);
});

it("should only evaluate callback once", () => {
    expect.assertions(2);
    const spy = jest.fn(() => 42);
    const fn = memoize(spy);
    const result1 = fn();
    const result2 = fn();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(result2);
});

it("should be lazy evaluated", () => {
    expect.assertions(1);
    const spy = jest.fn(() => 12);
    memoize(spy);
    expect(spy).toHaveBeenCalledTimes(0);
});

it("should handle different arguments", () => {
    expect.assertions(7);
    const spy = jest.fn((n: number) => n * 2);
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

it("should be usable as a decorator", async () => {
    // expect.assertions(6);
    const spySync = jest.fn(() => 1);
    const spyAsync = jest.fn(() => Promise.resolve(2));
    class MockClass {
        @memoize
        public expensiveCallSync(): number {
            return spySync();
        }

        @memoize
        public async expensiveCallAsync(): Promise<number> {
            return await spyAsync();
        }
    }
    const instance = new MockClass();
    const result1 = instance.expensiveCallSync();
    const result2 = instance.expensiveCallSync();
    const result3 = await instance.expensiveCallAsync();
    const result4 = await instance.expensiveCallAsync();
    expect(spySync).toHaveBeenCalledTimes(1);
    expect(spyAsync).toHaveBeenCalledTimes(1);
    expect(result1).toBe(1);
    expect(result3).toBe(2);
    expect(result1).toEqual(result2);
    expect(result3).toEqual(result4);
});

it("should handle async callbacks", async () => {
    expect.assertions(2);
    const spy = jest.fn(() => Promise.resolve(12));
    const fn = memoize(spy);
    const result1 = await fn();
    const result2 = await fn();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(result2);
});

it("should handle falsy return values", () => {
    expect.assertions(2 * 4);
    for (const value of [0, false, null, undefined]) {
        const spy = jest.fn(() => value);
        const fn = memoize(spy);
        const result1 = fn();
        const result2 = fn();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(result1).toEqual(result2);
    }
});
