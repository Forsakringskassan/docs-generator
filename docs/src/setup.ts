import { createApp, h } from "vue";
import { type SetupOptions } from "../../src/setup-options";

export function setup(options: SetupOptions): void {
    const { rootComponent, selector } = options;
    const app = createApp({
        render() {
            return h(rootComponent);
        },
    });
    app.mount(selector);
}
