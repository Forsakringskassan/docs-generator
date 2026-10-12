// docs/src/setup.ts
import { createApp, h } from "vue";
function setup(options) {
  const { rootComponent, selector } = options;
  const app = createApp({
    render() {
      return h(rootComponent);
    }
  });
  app.mount(selector);
}

// virtual-entry:virtual:docs/e2e/examples-imported-bar.vue:examples-imported-bar-5522a9.js
var exampleComponent = {};
function render(_ctx, _cache) {
  return "bar";
}
exampleComponent.render = render;
setup({
  rootComponent: exampleComponent,
  selector: "#example-5522a9"
});
export {
  render
};
