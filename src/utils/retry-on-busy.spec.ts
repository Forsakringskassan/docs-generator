import { describe, expect, it, vi } from "vitest";
import { retryOnBusy } from "./retry-on-busy";

describe("retryOnBusy()", () => {
    const busy = Object.assign(new Error("busy"), { code: "EBUSY" });

    it("should retry when failing with EBUSY", async () => {
        expect.assertions(2);
        const fn = vi
            .fn<() => Promise<string>>()
            .mockRejectedValueOnce(busy)
            .mockResolvedValueOnce("ok");
        await expect(retryOnBusy(fn, { delay: 0 })).resolves.toBe("ok");
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should throw EBUSY after all attempts", async () => {
        expect.assertions(2);
        const fn = vi.fn<() => Promise<string>>().mockRejectedValue(busy);
        await expect(retryOnBusy(fn, { attempts: 3, delay: 0 })).rejects.toBe(
            busy,
        );
        expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should not retry other errors", async () => {
        expect.assertions(2);
        const error = Object.assign(new Error("nope"), { code: "ENOENT" });
        const fn = vi.fn<() => Promise<string>>().mockRejectedValue(error);
        await expect(retryOnBusy(fn, { delay: 0 })).rejects.toBe(error);
        expect(fn).toHaveBeenCalledTimes(1);
    });
});
