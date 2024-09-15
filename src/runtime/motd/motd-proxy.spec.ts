import { motdProxy } from "./motd-proxy";

it("should throw error on usage", () => {
    expect.assertions(1);
    expect(() => {
        motdProxy.showMessage({
            message: "lorem ipsum",
        });
    }).toThrow(`motdProcessor(..) not enabled, cannot call showMessage(..)!`);
});
